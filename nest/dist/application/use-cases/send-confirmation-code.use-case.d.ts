import { RedisService } from '../../infrastructure/services/redis.service';
export declare class SendConfirmationCodeUseCase {
    private readonly redisService;
    constructor(redisService: RedisService);
    execute(email: string): Promise<string>;
}
