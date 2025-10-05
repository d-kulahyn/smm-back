import { UserRepository } from '../../domain/repositories/user.repository';
export declare class LogoutUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<void>;
}
