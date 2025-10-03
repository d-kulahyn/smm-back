import { UserRepository } from '../../domain/repositories/user.repository';
import { RedisService } from '../../infrastructure/services/redis.service';
export declare class ConfirmEmailUseCase {
    private readonly userRepository;
    private readonly redisService;
    constructor(userRepository: UserRepository, redisService: RedisService);
    execute(email: string, code: string): Promise<void>;
}
