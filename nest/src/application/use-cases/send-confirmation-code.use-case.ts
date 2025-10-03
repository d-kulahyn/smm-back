import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/services/redis.service';

@Injectable()
export class SendConfirmationCodeUseCase {
  constructor(private readonly redisService: RedisService) {}

  async execute(email: string): Promise<string> {
    // Генерируем 6-значный код подтверждения
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Сохраняем код в Redis на 10 минут
    await this.redisService.set(
      `email_verification:${email}`,
      confirmationCode,
      10 * 60 // 10 минут
    );

    // Здесь должна быть отправка email с кодом
    // Пока просто логируем
    console.log(`Email verification code for ${email}: ${confirmationCode}`);

    return confirmationCode;
  }
}
