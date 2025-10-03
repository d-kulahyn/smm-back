import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../../../shared';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';
import { LogoutUserUseCase } from '../../../application/use-cases/logout-user.use-case';
import { ResetPasswordUseCase } from '../../../application/use-cases/reset-password.use-case';
import { ConfirmEmailUseCase } from '../../../application/use-cases/confirm-email.use-case';
import { SendConfirmationCodeUseCase } from '../../../application/use-cases/send-confirmation-code.use-case';
import { SocialAuthUseCase } from '../../../application/use-cases/social-auth.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { RedisService } from '../../services/redis.service';
export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
    firebase_cloud_messaging_token?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ResetPasswordDto {
    email: string;
}
export declare class ConfirmEmailDto {
    code: string;
}
export declare class SocialAuthDto {
    access_token: string;
}
export declare class AuthController {
    private readonly createUserUseCase;
    private readonly loginUserUseCase;
    private readonly logoutUserUseCase;
    private readonly resetPasswordUseCase;
    private readonly confirmEmailUseCase;
    private readonly sendConfirmationCodeUseCase;
    private readonly socialAuthUseCase;
    private readonly jwtService;
    private readonly redisService;
    private readonly userRepository;
    constructor(createUserUseCase: CreateUserUseCase, loginUserUseCase: LoginUserUseCase, logoutUserUseCase: LogoutUserUseCase, resetPasswordUseCase: ResetPasswordUseCase, confirmEmailUseCase: ConfirmEmailUseCase, sendConfirmationCodeUseCase: SendConfirmationCodeUseCase, socialAuthUseCase: SocialAuthUseCase, jwtService: JwtService, redisService: RedisService, userRepository: UserRepository);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            email: string;
            name: string;
            code: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            role: string;
            permissions: import("../../../shared").Permission[];
            isActive: boolean;
            emailVerifiedAt: Date;
        };
    }>;
    sendConfirmationCode(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    logout(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    confirmEmail(confirmEmailDto: ConfirmEmailDto, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    social(socialAuthDto: SocialAuthDto, provider: string): Promise<{
        access_token: string;
    }>;
    me(req: AuthenticatedRequest): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
        permissions: string[];
        isActive: boolean;
        emailVerifiedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
