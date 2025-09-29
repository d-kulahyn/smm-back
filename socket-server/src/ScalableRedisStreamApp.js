import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import Redis from 'ioredis';
import cluster from 'cluster';
import os from 'os';

import {HighPerformanceRedisStreamService} from './services/HighPerformanceRedisStreamService.js';
import {StreamPoolManager} from './managers/StreamPoolManager.js';
import {HighPerformanceStreamProcessor} from './processors/HighPerformanceStreamProcessor.js';
import {LifecycleManager} from './managers/LifecycleManager.js';
import {Logger} from './utils/Logger.js';

export class ScalableRedisStreamApp {
    constructor(config = {}) {
        this.config = {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || '',
                db: process.env.REDIS_DB || 0,

                family: 4,
                keepAlive: true,
                maxRetriesPerRequest: 3,
                retryDelayOnFailover: 100,
                lazyConnect: true,
            },
            server: {
                port: process.env.PORT || 3000,
                host: process.env.HOST || '0.0.0.0',
            },
            cluster: {
                enabled: process.env.CLUSTER_ENABLED === 'true',
                workers: parseInt(process.env.CLUSTER_WORKERS) || os.cpus().length,
            },
            performance: {
                poolSize: parseInt(process.env.POOL_SIZE) || 50,
                maxPools: parseInt(process.env.MAX_POOLS) || 20,
                scanCount: parseInt(process.env.SCAN_COUNT) || 1000,
                maxStreamsPerRead: parseInt(process.env.MAX_STREAMS_PER_READ) || 50,
                maxConcurrentPools: parseInt(process.env.MAX_CONCURRENT_POOLS) || 10,
                batchProcessingDelay: parseInt(process.env.BATCH_DELAY) || 50,
                maxMessagesPerBatch: parseInt(process.env.MAX_MESSAGES_BATCH) || 500,
            },
            socketIO: {
                cors: {origin: '*'},
                transports: ['websocket'],
                pingTimeout: 60000,
                pingInterval: 25000,
                upgradeTimeout: 30000,
                maxHttpBufferSize: 1e6, // 1MB
                adapter: process.env.SOCKETIO_REDIS_ADAPTER === 'true',
            },
            logLevel: process.env.LOG_LEVEL || 'info',
            ...config
        };

        if (!cluster.isPrimary || !this.config.cluster.enabled) {
            this._initializeComponents();
        }
    }

    _initializeComponents() {
        this.logger = new Logger(this.config.logLevel);
        this.lifecycleManager = new LifecycleManager(this.logger);

        this.app = express();
        this.httpServer = createServer(this.app);

        // Добавляем health endpoint для Docker healthcheck
        this.app.get('/health', (req, res) => {
            const healthStatus = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                redis: this.redis?.status || 'unknown'
            };
            res.status(200).json(healthStatus);
        });

        this.io = new Server(this.httpServer, this.config.socketIO);

        this.redis = this._createOptimizedRedisConnection();

        this.redisStreamService = new HighPerformanceRedisStreamService(this.redis, {
            scanCount: this.config.performance.scanCount,
            maxStreamsPerRead: this.config.performance.maxStreamsPerRead,
            keyPattern: process.env.STREAM_PATTERN || 'socket.*'
        });

        this.poolManager = new StreamPoolManager({
            poolSize: this.config.performance.poolSize,
            maxPools: this.config.performance.maxPools,
            priorityStreams: this._getPriorityStreams(),
        });

        this.streamProcessor = new HighPerformanceStreamProcessor(
            this.redisStreamService,
            this.poolManager,
            this.io,
            this.logger,
            {
                maxConcurrentPools: this.config.performance.maxConcurrentPools,
                batchProcessingDelay: this.config.performance.batchProcessingDelay,
                maxMessagesPerBatch: this.config.performance.maxMessagesPerBatch,
            }
        );

        this._setupEventHandlers();
    }

    _createOptimizedRedisConnection() {
        const redisOptions = {
            ...this.config.redis,
            connectTimeout: 10000,
            commandTimeout: 5000,
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 2,
            enableAutoPipelining: true,
        };

        const redis = new Redis(redisOptions);

        redis.on('connect', () => {
            this.logger.info(`✅ Redis connected (Worker ${process.pid})`);
        });

        redis.on('error', (error) => {
            this.logger.error('Redis error:', error);
        });

        return redis;
    }

    _getPriorityStreams() {
        const priority = process.env.PRIORITY_STREAMS;
        return priority ? priority.split(',') : [];
    }

    _setupEventHandlers() {
        this.io.on('connection', (socket) => {
            this.logger.debug(`Socket connected: ${socket.id} (Worker ${process.pid})`);
            this._registerOptimizedSocketHandlers(socket);
        });

        this.streamProcessor.on('messagesProcessed', ({streamName, count}) => {
            this.logger.debug(`Processed ${count} messages in ${streamName}`);
        });

        this.lifecycleManager.onShutdown(() => this._shutdown());

        this._setupPerformanceMonitoring();
    }

    _registerOptimizedSocketHandlers(socket) {
        const maxRooms = parseInt(process.env.MAX_ROOMS_PER_SOCKET) || 100;
        let joinedRooms = 0;

        socket.on('join-room', (roomId) => {
            if (joinedRooms < maxRooms) {
                socket.join(roomId);
                joinedRooms++;
                this.logger.debug(`Socket ${socket.id} joined room ${roomId}`);
            } else {
                this.logger.warn(`Socket ${socket.id} reached max rooms limit`);
                socket.emit('error', {message: 'Max rooms limit reached'});
            }
        });

        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
            joinedRooms = Math.max(0, joinedRooms - 1);
        });

        socket.on('disconnect', () => {
            this.logger.debug(`Socket disconnected: ${socket.id}`);
        });
    }

    _setupPerformanceMonitoring() {
        setInterval(() => {
            const metrics = this.streamProcessor.getMetrics();
            const memUsage = process.memoryUsage();

            this.logger.info(`📈 Worker ${process.pid} Performance:`, {
                ...metrics,
                memory: {
                    rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
                    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
                },
                connectedSockets: this.io.engine.clientsCount,
            });
        }, 30000);
    }

    async start() {
        if (this.config.cluster.enabled && cluster.isPrimary) {
            return this._startCluster();
        } else {
            return this._startWorker();
        }
    }

    _startCluster() {
        const numWorkers = this.config.cluster.workers;

        console.log(`🚀 Starting cluster with ${numWorkers} workers...`);

        for (let i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
            cluster.fork();
        });

        console.log(`✅ Cluster started with ${numWorkers} workers`);
    }

    async _startWorker() {
        try {
            await new Promise((resolve, reject) => {
                this.httpServer.listen(this.config.server.port, this.config.server.host, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            this.logger.info(`🚀 Worker ${process.pid} running on http://${this.config.server.host}:${this.config.server.port}`);

            await this.streamProcessor.start();

            this.logger.info(`✅ Worker ${process.pid} started successfully`);

        } catch (error) {
            this.logger.error(`❌ Failed to start worker ${process.pid}:`, error);
            throw error;
        }
    }

    async _shutdown() {
        this.logger.info(`Shutting down worker ${process.pid}...`);

        if (this.streamProcessor) {
            await this.streamProcessor.stop();
        }

        if (this.redis) {
            this.redis.disconnect();
        }

        if (this.httpServer) {
            await new Promise((resolve) => {
                this.httpServer.close(() => {
                    this.logger.info(`Worker ${process.pid} HTTP server closed`);
                    resolve();
                });
            });
        }
    }

    getSocketIO() {
        return this.io;
    }

    getRedis() {
        return this.redis;
    }

    getLogger() {
        return this.logger;
    }
}
