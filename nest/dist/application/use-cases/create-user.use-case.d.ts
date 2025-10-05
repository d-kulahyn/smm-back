import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
export interface CreateUserCommand {
    email: string;
    password: string;
    name?: string;
    role: string;
    permissions?: string[];
    firebase_cloud_messaging_token?: string;
}
export declare class CreateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(command: CreateUserCommand): Promise<User>;
}
