import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export interface CreateUserCommand {
  email: string;
  password: string;
  name?: string;
  role: string;
  permissions?: string[];
  firebase_cloud_messaging_token?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    const user = new User(
      crypto.randomUUID(),
      command.email,
      hashedPassword,
      command.name || 'User', // Устанавливаем значение по умолчанию если name не указан
      command.role, // Добавляем role
      undefined, // avatar
      true, // isActive
      undefined, // emailVerifiedAt - будет установлен после подтверждения
    );

    return this.userRepository.create(user);
  }
}
