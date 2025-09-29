import { EventEmitter } from 'events';
import { MessageProcessor } from './MessageProcessor.js';

export class HighPerformanceStreamProcessor extends EventEmitter {
    constructor(redisStreamService, poolManager, socketIO, logger, options = {}) {
        super();
        this.redisService = redisStreamService;
        this.poolManager = poolManager;
        this.socketIO = socketIO;
        this.logger = logger;

        this.options = {
            maxConcurrentPools: options.maxConcurrentPools || 20,
            batchProcessingDelay: options.batchProcessingDelay || 10,
            metricsInterval: options.metricsInterval || 30000,
            cleanupInterval: options.cleanupInterval || 300000,
            maxMessagesPerBatch: options.maxMessagesPerBatch || 100,
            ...options
        };

        this.isRunning = false;
        this.activeWorkers = new Set();
        this.processingStats = {
            messagesProcessed: 0,
            errorsCount: 0,
            avgProcessingTime: 0,
            startTime: Date.now()
        };

        this._setupIntervals();
    }

    _setupIntervals() {
        this.cleanupInterval = setInterval(() => {
            this._cleanupInactiveStreams();
        }, this.options.cleanupInterval);
    }

    async start() {
        if (this.isRunning) {
            this.logger.warn('High-performance stream processor already running');
            return;
        }

        this.isRunning = true;
        this.processingStats.startTime = Date.now();

        this.logger.info('🚀 Starting high-performance stream processing...');

        this._startStreamDiscovery();
        this._startPoolProcessing();

        this.emit('started');
    }

    async stop() {
        this.isRunning = false;

        for (const worker of this.activeWorkers) {
            clearTimeout(worker);
        }
        this.activeWorkers.clear();

        clearInterval(this.cleanupInterval);

        this.logger.info('High-performance stream processor stopped');
        this.emit('stopped');
    }

    async _startStreamDiscovery() {
        const scanStreams = async () => {
            if (!this.isRunning) return;

            try {
                let discovered = 0;

                for await (const streamBatch of this.redisService.scanStreams()) {
                    streamBatch.forEach(streamName => {
                        this.poolManager.addStream(streamName);
                        discovered++;
                    });

                    await new Promise(resolve => setImmediate(resolve));
                }

                if (discovered > 0) {
                    this.logger.info(`📡 Discovered ${discovered} streams`);
                }

                const timeoutId = setTimeout(scanStreams, 10000);
                this.activeWorkers.add(timeoutId);

            } catch (error) {
                this.logger.error('Stream discovery error:', error);
                const timeoutId = setTimeout(scanStreams, 30000);
                this.activeWorkers.add(timeoutId);
            }
        };

        scanStreams();
    }

    _startPoolProcessing() {
        const processNextPool = async () => {
            if (!this.isRunning) return;

            try {
                const pools = this.poolManager.createProcessingPools();
                const activePools = pools.slice(0, this.options.maxConcurrentPools);

                await Promise.all(
                    activePools.map(pool => this._processPool(pool))
                );

                const timeoutId = setTimeout(processNextPool, this.options.batchProcessingDelay);
                this.activeWorkers.add(timeoutId);

            } catch (error) {
                this.logger.error('Pool processing error:', error);
                const timeoutId = setTimeout(processNextPool, 5000);
                this.activeWorkers.add(timeoutId);
            }
        };

        processNextPool();
    }

    async _processPool(streamPool) {
        if (streamPool.length === 0) return;

        const startTime = Date.now();

        try {
            const streamIds = streamPool.map(() => '0');
            const result = await this.redisService.readStreamsBatch(streamPool, streamIds, 1000);

            if (result && result.length > 0) {
                await this._processBatchMessages(result);
            }

            this.processingStats.avgProcessingTime =
                (this.processingStats.avgProcessingTime + (Date.now() - startTime)) / 2;

        } catch (error) {
            this.processingStats.errorsCount++;
            this.logger.error(`Pool processing error for ${streamPool.length} streams:`, error);
            this.emit('poolError', { pool: streamPool, error });
        }
    }

    async _processBatchMessages(results) {
        const messagesPerStream = new Map();
        let totalMessages = 0;

        for (const [streamName, messages] of results) {
            messagesPerStream.set(streamName, messages);
            totalMessages += messages.length;

            if (messages.length > 0) {
                this.poolManager.updateActivity(streamName);
            }
        }

        this.logger.debug(`Processing ${totalMessages} messages from ${results.length} streams`);

        for (const [streamName, messages] of messagesPerStream) {
            await this._processStreamMessages(streamName, messages);
        }

        this.processingStats.messagesProcessed += totalMessages;
    }

    async _processStreamMessages(streamName, messages) {
        const processedMessages = [];
        const messagesToDelete = [];

        try {
            this.logger.info(`🔄 Processing ${messages.length} messages from stream "${streamName}"`);

            const batches = this._chunkArray(messages, Math.min(this.options.maxMessagesPerBatch, 50));

            await Promise.all(batches.map(async (batch) => {
                const batchProcessed = [];
                const batchToDelete = [];

                for (const [messageId, fields] of batch) {
                    try {
                        const processedMessage = MessageProcessor.processMessage(messageId, fields, streamName);

                        this.logger.info(`📨 Stream "${streamName}" Message ID: ${messageId}`, {
                            event: processedMessage.original.event || 'unknown',
                            dataSize: processedMessage.original.data ? processedMessage.original.data.length : 0,
                            fields: Object.keys(processedMessage.original),
                            parsedData: processedMessage.original
                        });

                        const roomsCount = this.socketIO.sockets.adapter.rooms.get(streamName)?.size || 0;
                        this.socketIO.to(streamName).emit('room:message', processedMessage.socket);

                        this.logger.info(`📤 Message ${messageId} sent to ${roomsCount} clients in room "${streamName}"`);

                        batchProcessed.push(processedMessage);
                        batchToDelete.push(messageId);

                    } catch (error) {
                        this.logger.error(`❌ Message processing error ${messageId} in stream "${streamName}":`, {
                            error: error.message,
                            stack: error.stack,
                            messageFields: fields
                        });
                        this.processingStats.errorsCount++;
                    }
                }

                processedMessages.push(...batchProcessed);
                messagesToDelete.push(...batchToDelete);
            }));

            if (messagesToDelete.length > 0) {
                await this.redisService.deleteMessagesBatch(streamName, messagesToDelete);

                this.logger.info(`🗑️ Deleted ${messagesToDelete.length} processed messages from stream "${streamName}"`);
            }

            if (processedMessages.length > 0) {
                this.logger.info(`✅ Stream "${streamName}" processing completed: ${processedMessages.length} messages processed successfully`);

                this.emit('messagesProcessed', {
                    streamName,
                    count: processedMessages.length,
                    messages: processedMessages
                });
            }

        } catch (error) {
            this.logger.error(`💥 Stream processing error for "${streamName}":`, {
                error: error.message,
                messagesCount: messages.length,
                stack: error.stack
            });
            this.emit('streamError', { streamName, error });
        }
    }

    _chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    _cleanupInactiveStreams() {
        const cleaned = this.poolManager.cleanupInactiveStreams();
        if (cleaned.length > 0) {
            this.logger.info(`🗑️ Cleaned up ${cleaned.length} inactive streams`);
        }
    }

    getMetrics() {
        return {
            ...this.processingStats,
            uptime: Date.now() - this.processingStats.startTime,
            poolStats: this.poolManager.getStats()
        };
    }
}
