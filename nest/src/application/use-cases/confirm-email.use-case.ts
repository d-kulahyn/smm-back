import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RedisService } from '../../infrastructure/services/redis.service';

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(email: string, code: string): Promise<void> {
    const storedCode = await this.redisService.get(`email_confirmation:${email}`);

    if (!storedCode || storedCode !== code) {
      throw new Error('Invalid or expired confirmation code');
    }

    await this.userRepository.confirmEmail(email);

    await this.redisService.del(`email_confirmation:${email}`);
  }
}
