import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../api/controllers/auth.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { ConfirmEmailUseCase } from '../../application/use-cases/confirm-email.use-case';
import { SendConfirmationCodeUseCase } from '../../application/use-cases/send-confirmation-code.use-case';
import { SocialAuthUseCase } from '../../application/use-cases/social-auth.use-case';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../services/redis.service';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';

export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    LoginUserUseCase,
    LogoutUserUseCase,
    ResetPasswordUseCase,
    ConfirmEmailUseCase,
    SendConfirmationCodeUseCase,
    SocialAuthUseCase,

    // Services
    PrismaService,
    RedisService,
    JwtStrategy,

    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
