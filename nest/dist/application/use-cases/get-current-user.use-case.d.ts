import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
export declare class GetCurrentUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<User>;
}
