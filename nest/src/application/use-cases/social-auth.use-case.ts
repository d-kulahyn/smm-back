import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

export interface SocialAuthCommand {
  accessToken: string;
  provider: string;
}

@Injectable()
export class SocialAuthUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: SocialAuthCommand): Promise<string> {
    // Здесь должна быть интеграция с провайдерами социальных сетей
    // Пока создаем заглушку для демонстрации

    let socialUserData;
    try {
      socialUserData = await this.validateSocialToken(command.accessToken, command.provider);
    } catch (error) {
      throw new Error('Invalid social token');
    }

    // Ищем пользователя по email
    let user = await this.userRepository.findByEmail(socialUserData.email);

    if (!user) {
      // Создаем нового пользователя если не найден
      user = new User(
        crypto.randomUUID(),
        socialUserData.email,
        crypto.randomUUID(), // Генерируем случайный пароль для социальной регистрации
        socialUserData.name,
        'CLIENT', // Устанавливаем роль как строку
        socialUserData.avatar,
        true,
        new Date(), // Email уже подтвержден через социальную сеть
      );

      user = await this.userRepository.create(user);
    }

    // Генерируем JWT токен с ролью и разрешениями
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: [] // Можно добавить логику получения разрешений по роли
    };
    return this.jwtService.sign(payload);
  }

  private async validateSocialToken(accessToken: string, provider: string): Promise<any> {
    // Заглушка для валидации токена социальной сети
    // В реальном проекте здесь должны быть запросы к API провайдеров
    switch (provider) {
      case 'google':
        return {
          email: 'user@gmail.com',
          name: 'Social User',
          avatar: 'https://via.placeholder.com/150'
        };
      case 'facebook':
        return {
          email: 'user@facebook.com',
          name: 'Facebook User',
          avatar: 'https://via.placeholder.com/150'
        };
      default:
        throw new Error('Unsupported social provider');
    }
  }
}
