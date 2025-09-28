export class HighPerformanceRedisStreamService {
    constructor(redisClient, options = {}) {
        this.redis = redisClient;
        this.options = {
            scanCount: options.scanCount || 1000,
            maxStreamsPerRead: options.maxStreamsPerRead || 100,
            keyPattern: options.keyPattern || '*',
            ...options
        };
    }

    async *scanStreams(cursor = '0') {
        do {
            const result = await this.redis.scan(
                cursor,
                'MATCH', this.options.keyPattern,
                'COUNT', this.options.scanCount
            );

            cursor = result[0];
            const keys = result[1];

            if (keys.length > 0) {
                const streamKeys = [];

                for (const key of keys) {
                    if (await this.isStream(key)) {
                        streamKeys.push(key);
                    }
                }

                if (streamKeys.length > 0) {
                    yield streamKeys;
                }
            }
        } while (cursor !== '0');
    }

    async readStreamsBatch(streamBatch, streamIds, blockTime = 1000) {
        if (streamBatch.length === 0) return null;

        const batchSize = Math.min(streamBatch.length, this.options.maxStreamsPerRead);
        const streams = streamBatch.slice(0, batchSize);
        const ids = streamIds.slice(0, batchSize);

        return await this.redis.xread(
            'BLOCK', blockTime,
            'STREAMS',
            ...streams,
            ...ids
        );
    }

    async isStream(key) {
        try {
            const type = await this.redis.type(key);
            return type === 'stream';
        } catch (error) {
            return false;
        }
    }

    async getStreamInfo(streamName) {
        try {
            return await this.redis.xinfo('STREAM', streamName);
        } catch (error) {
            return null;
        }
    }

    async deleteMessagesBatch(streamName, messageIds) {
        if (messageIds.length === 0) return;

        return await this.redis.xdel(streamName, ...messageIds);
    }

    async getAllKeys() {
        return await this.redis.keys('*');
    }

    async deleteMessage(streamName, messageId) {
        await this.redis.xdel(streamName, messageId);
    }
}
