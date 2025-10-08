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
import {ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse} from '@nestjs/swagger';
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

import {
    RegisterDto,
    LoginDto,
    ResetPasswordDto,
    ConfirmEmailDto,
    SocialAuthDto
} from '../requests';

import {
    RegisterResponseDto,
    LoginResponseDto,
    MessageResponseDto,
    ErrorResponseDto,
    UserProfileResponseDto
} from '../responses';

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
