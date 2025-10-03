import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
export interface LoginUserCommand {
    email: string;
    password: string;
}
export interface LoginUserResult {
    user: User;
    isValid: boolean;
}
export declare class LoginUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(command: LoginUserCommand): Promise<LoginUserResult>;
}
