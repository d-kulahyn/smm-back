import {Injectable, OnModuleDestroy} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor(private configService: ConfigService) {
        this.client = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
            password: this.configService.get('REDIS_PASSWORD'),
        });
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    // Set operations
    async sadd(key: string, member: string | number): Promise<number> {
        return this.client.sadd(key, String(member));
    }

    async sismember(key: string, member: string | number): Promise<boolean> {
        const res = await this.client.sismember(key, String(member));
        return res === 1;
    }

    async smembers(key: string): Promise<string[]> {
        return this.client.smembers(key);
    }

    async srem(key: string, member: string | number): Promise<number> {
        return this.client.srem(key, String(member));
    }

    async scard(key: string): Promise<number> {
        return this.client.scard(key);
    }

    async expire(key: string, seconds: number): Promise<number> {
        return this.client.expire(key, seconds);
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    async addToStream(
        streamName: string,
        data: Record<string, string | number>,
        options?: {
            maxLen?: number;
            id?: string;
        }
    ): Promise<string> {
        const fieldValuePairs: (string | number)[] = [];
        for (const [key, value] of Object.entries(data)) {
            fieldValuePairs.push(key, String(value));
        }

        const messageId = options?.id || '*';

        if (options?.maxLen) {
            return this.client.xadd(
                streamName,
                'MAXLEN',
                '~',
                options.maxLen,
                messageId,
                ...fieldValuePairs
            );
        }

        return this.client.xadd(streamName, messageId, ...fieldValuePairs);

    }
}
