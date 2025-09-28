import { ScalableRedisStreamApp } from './src/ScalableRedisStreamApp.js';
import { registerSocketHandlers } from './socket/index.js';
import os from 'os';

async function main() {
    try {
        const app = new ScalableRedisStreamApp({
            logLevel: process.env.LOG_LEVEL || 'info',

            cluster: {
                enabled: process.env.CLUSTER_ENABLED === 'true',
                workers: parseInt(process.env.CLUSTER_WORKERS) || os.cpus().length,
            },

            performance: {
                poolSize: 100,
                maxPools: 50,
                scanCount: 5000,
                maxStreamsPerRead: 100,
                maxConcurrentPools: 20,
                batchProcessingDelay: 10,
                maxMessagesPerBatch: 1000,
            },

            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || '',
                db: process.env.REDIS_DB || 0,

                enableAutoPipelining: true,
                maxRetriesPerRequest: 2,
                connectTimeout: 10000,
            },

            socketIO: {
                cors: { origin: '*' },
                transports: ['websocket'],
                pingTimeout: 60000,
                adapter: process.env.SOCKETIO_REDIS_ADAPTER === 'true',
            }
        });

        if (process.env.NODE_APP_INSTANCE !== undefined || !process.env.CLUSTER_ENABLED) {
            const io = app.getSocketIO?.();
            const redis = app.getRedis?.();

            if (io && redis) {
                io.on('connection', (socket) => {
                    registerSocketHandlers(socket, io, redis);
                });
            }
        }

        await app.start();

    } catch (error) {
        console.error('❌ Failed to start scalable application:', error);
        process.exit(1);
    }
}

main();
