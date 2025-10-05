import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleDestroy {
    private configService;
    private readonly client;
    constructor(configService: ConfigService);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    onModuleDestroy(): void;
    addToStream(streamName: string, data: Record<string, string | number>, options?: {
        maxLen?: number;
        id?: string;
    }): Promise<string>;
}
