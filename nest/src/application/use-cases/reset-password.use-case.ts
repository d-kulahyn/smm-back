import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RedisService } from '../../infrastructure/services/redis.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Генерируем код сброса пароля
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Сохраняем код в Redis на 15 минут
    await this.redisService.set(
      `password_reset:${email}`,
      resetCode,
      15 * 60 // 15 минут
    );

    // Здесь должна быть отправка email с кодом
    // Пока просто логируем
    console.log(`Password reset code for ${email}: ${resetCode}`);
  }
}
