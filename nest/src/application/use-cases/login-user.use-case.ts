import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  user: User;
  isValid: boolean;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      return { user: null, isValid: false };
    }

    const isValid = await bcrypt.compare(command.password, user.password);
    return { user, isValid };
  }
}
