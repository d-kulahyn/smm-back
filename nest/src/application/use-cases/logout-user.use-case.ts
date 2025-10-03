import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LogoutUserUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    // В JWT токенах нет централизованного управления сессиями
    // Можно добавить blacklist токенов в Redis если нужно
    // Пока просто возвращаем успешный результат
    return Promise.resolve();
  }
}
