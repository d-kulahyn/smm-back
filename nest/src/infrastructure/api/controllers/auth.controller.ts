import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Param,
    HttpException,
    BadRequestException,
    Inject
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse, ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength, IsOptional} from 'class-validator';
import {JwtService} from '@nestjs/jwt';
import {AuthenticatedRequest} from '../../../shared';
import {CreateUserUseCase} from '../../../application/use-cases/create-user.use-case';
import {LoginUserUseCase} from '../../../application/use-cases/login-user.use-case';
import {LogoutUserUseCase} from '../../../application/use-cases/logout-user.use-case';
import {ResetPasswordUseCase} from '../../../application/use-cases/reset-password.use-case';
import {ConfirmEmailUseCase} from '../../../application/use-cases/confirm-email.use-case';
import {SendConfirmationCodeUseCase} from '../../../application/use-cases/send-confirmation-code.use-case';
import {SocialAuthUseCase} from '../../../application/use-cases/social-auth.use-case';
import {UserRepository} from '../../../domain/repositories/user.repository';
import {JwtAuthGuard} from '../../../shared/guards/jwt-auth.guard';
import {Role, RolePermissions} from '../../../shared';
import {RedisService} from '../../services/redis.service';
import {ResourceNotFoundException} from '../../../shared/exceptions';

export class RegisterDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', minLength: 6, example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'User name', required: false, example: 'John Doe' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Firebase Cloud Messaging token', required: false })
    @IsOptional()
    @IsString()
    firebase_cloud_messaging_token?: string;
}

export class LoginDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsString()
    password: string;
}

export class ResetPasswordDto {
    @ApiProperty({ description: 'User email for password reset', example: 'user@example.com' })
    @IsEmail()
    email: string;
}

export class ConfirmEmailDto {
    @ApiProperty({ description: 'Email confirmation code', example: 'A1B2C3' })
    @IsString()
    code: string;
}

export class SocialAuthDto {
    @ApiProperty({ description: 'Social provider access token', example: 'ya29.a0AfH6SMB...' })
    @IsString()
    access_token: string;
}

// Response DTOs для Swagger документации
export class RegisterResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Registration successful. Please check your email for verification code.' })
    message: string;

    @ApiProperty({
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'clm1abc123def456' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            code: { type: 'string', example: 'A1B2C3' }
        }
    })
    data: {
        userId: string;
        email: string;
        name: string;
        code: string;
    };
}

export class LoginResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;

    @ApiProperty({
        type: 'object',
        properties: {
            id: { type: 'string', example: 'clm1abc123def456' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string', nullable: true, example: null },
            role: { type: 'string', example: 'CLIENT' },
            permissions: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean', example: true },
            emailVerifiedAt: { type: 'string', nullable: true, example: null }
        }
    })
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: string;
        permissions: string[];
        isActive: boolean;
        emailVerifiedAt: string | null;
    };
}

export class MessageResponseDto {
    @ApiProperty({ example: 'Operation completed successfully' })
    message: string;
}

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({ example: 'Validation failed' })
    message: string;
}

export class UserProfileResponseDto {
    @ApiProperty({ example: 'clm1abc123def456' })
    id: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: null, nullable: true })
    avatar: string | null;

    @ApiProperty({ example: 'CLIENT' })
    role: string;

    @ApiProperty({ type: 'array', items: { type: 'string' } })
    permissions: string[];

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: null, nullable: true })
    emailVerifiedAt: string | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly logoutUserUseCase: LogoutUserUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly confirmEmailUseCase: ConfirmEmailUseCase,
        private readonly sendConfirmationCodeUseCase: SendConfirmationCodeUseCase,
        private readonly socialAuthUseCase: SocialAuthUseCase,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: UserRepository,
    ) {
    }

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Create a new user account with CLIENT role and full project management permissions'
    })
    @ApiResponse({ status: 201, description: 'User successfully registered', type: RegisterResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto })
    async register(@Body() registerDto: RegisterDto) {
        try {
            const role = Role.CLIENT;
            const permissions = RolePermissions[role];

            const user = await this.createUserUseCase.execute({
                email: registerDto.email,
                password: registerDto.password,
                name: registerDto.name,
                role: role,
                permissions,
            });

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            await this.redisService.set(`email_confirmation:${registerDto.email}`, code, 3600);

            return {
                success: true,
                message: 'Registration successful. Please check your email for verification code.',
                data: {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    code: code,
                }
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login user',
        description: 'Authenticate user and return access token with permissions'
    })
    @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid credentials', type: ErrorResponseDto })
    async login(@Body() loginDto: LoginDto) {
        try {
            const result = await this.loginUserUseCase.execute(loginDto);

            if (!result.isValid) {
                throw new BadRequestException('Bad login or password');
            }

            const payload = {
                sub: result.user.id,
                email: result.user.email,
                role: result.user.role,
                permissions: result.user.permissions
            };
            const token = this.jwtService.sign(payload);

            return {
                success: true,
                access_token: token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    avatar: result.user.avatar,
                    role: result.user.role,
                    permissions: result.user.permissions,
                    isActive: result.user.isActive,
                    emailVerifiedAt: result.user.emailVerifiedAt,
                },
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('email/verification-code')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Send email verification code',
        description: 'Send verification code to user\'s email'
    })
    @ApiResponse({ status: 200, description: 'Verification code sent', type: MessageResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    async sendConfirmationCode(@Request() req: AuthenticatedRequest) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new ResourceNotFoundException('User', req.user.userId);
            }
            await this.sendConfirmationCodeUseCase.execute(user.email);

            return {message: 'Confirmation code has been sent'};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Logout user',
        description: 'Revoke user\'s access token'
    })
    @ApiResponse({ status: 200, description: 'Logout successful', type: MessageResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    async logout(@Request() req: AuthenticatedRequest) {
        try {
            await this.logoutUserUseCase.execute(req.user.userId);
            return {message: 'Token has been deleted successfully'};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('reset-password')
    @ApiOperation({
        summary: 'Reset password',
        description: 'Send password reset email to user'
    })
    @ApiResponse({ status: 200, description: 'Reset email sent', type: MessageResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            await this.resetPasswordUseCase.execute(resetPasswordDto.email);
            return {message: 'Email has been sent'};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post('email/confirm')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Confirm email',
        description: 'Confirm user\'s email address with verification code'
    })
    @ApiResponse({ status: 200, description: 'Email confirmed', type: MessageResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid code', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto, @Request() req: AuthenticatedRequest) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new ResourceNotFoundException('User', req.user.userId);
            }
            await this.confirmEmailUseCase.execute(user.email, confirmEmailDto.code);
            return {message: 'Email has been verified'};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('social/:provider')
    @ApiParam({
        name: 'provider',
        enum: ['google', 'facebook', 'apple'],
        description: 'Social provider name'
    })
    @ApiOperation({
        summary: 'Social authentication',
        description: 'Authenticate user via social provider (Google, Facebook, etc.)'
    })
    @ApiResponse({
        status: 200,
        description: 'Social login successful',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid token or provider', type: ErrorResponseDto })
    async social(
        @Body() socialAuthDto: SocialAuthDto,
        @Param('provider') provider: string
    ) {
        try {
            const token = await this.socialAuthUseCase.execute({
                accessToken: socialAuthDto.access_token,
                provider: provider,
            });

            return {access_token: token};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('user/me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user',
        description: 'Get authenticated user information'
    })
    @ApiResponse({ status: 200, description: 'User profile retrieved', type: UserProfileResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    async me(@Request() req: AuthenticatedRequest) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new ResourceNotFoundException('User', req.user.userId);
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                permissions: req.user.permissions, // Получаем разрешения из токена
                isActive: user.isActive,
                emailVerifiedAt: user.emailVerifiedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
}
