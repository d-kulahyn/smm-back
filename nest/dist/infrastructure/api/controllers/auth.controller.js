"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const create_user_use_case_1 = require("../../../application/use-cases/create-user.use-case");
const login_user_use_case_1 = require("../../../application/use-cases/login-user.use-case");
const logout_user_use_case_1 = require("../../../application/use-cases/logout-user.use-case");
const reset_password_use_case_1 = require("../../../application/use-cases/reset-password.use-case");
const confirm_email_use_case_1 = require("../../../application/use-cases/confirm-email.use-case");
const send_confirmation_code_use_case_1 = require("../../../application/use-cases/send-confirmation-code.use-case");
const social_auth_use_case_1 = require("../../../application/use-cases/social-auth.use-case");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const redis_service_1 = require("../../services/redis.service");
const exceptions_1 = require("../../../shared/exceptions");
const requests_1 = require("../requests");
const responses_1 = require("../responses");
let AuthController = class AuthController {
    constructor(createUserUseCase, loginUserUseCase, logoutUserUseCase, resetPasswordUseCase, confirmEmailUseCase, sendConfirmationCodeUseCase, socialAuthUseCase, jwtService, redisService, userRepository) {
        this.createUserUseCase = createUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.logoutUserUseCase = logoutUserUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.confirmEmailUseCase = confirmEmailUseCase;
        this.sendConfirmationCodeUseCase = sendConfirmationCodeUseCase;
        this.socialAuthUseCase = socialAuthUseCase;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.userRepository = userRepository;
    }
    async register(registerDto) {
        try {
            const role = shared_1.Role.CLIENT;
            const permissions = shared_1.RolePermissions[role];
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(loginDto) {
        try {
            const result = await this.loginUserUseCase.execute(loginDto);
            if (!result.isValid) {
                throw new common_1.BadRequestException('Bad login or password');
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendConfirmationCode(req) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
            }
            await this.sendConfirmationCodeUseCase.execute(user.email);
            return { message: 'Confirmation code has been sent' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(req) {
        try {
            await this.logoutUserUseCase.execute(req.user.userId);
            return { message: 'Token has been deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            await this.resetPasswordUseCase.execute(resetPasswordDto.email);
            return { message: 'Email has been sent' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async confirmEmail(confirmEmailDto, req) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
            }
            await this.confirmEmailUseCase.execute(user.email, confirmEmailDto.code);
            return { message: 'Email has been verified' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async social(socialAuthDto, provider) {
        try {
            const token = await this.socialAuthUseCase.execute({
                accessToken: socialAuthDto.access_token,
                provider: provider,
            });
            return { access_token: token };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async me(req) {
        try {
            const user = await this.userRepository.findById(req.user.userId);
            if (!user) {
                throw new exceptions_1.ResourceNotFoundException('User', req.user.userId);
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                permissions: req.user.permissions,
                isActive: user.isActive,
                emailVerifiedAt: user.emailVerifiedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new user account with CLIENT role and full project management permissions'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered', type: responses_1.RegisterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
        description: 'Authenticate user and return access token with permissions'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful', type: responses_1.LoginResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid credentials', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('email/verification-code'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send email verification code',
        description: 'Send verification code to user\'s email'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification code sent', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendConfirmationCode", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout user',
        description: 'Revoke user\'s access token'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout successful', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password',
        description: 'Send password reset email to user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reset email sent', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('email/confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm email',
        description: 'Confirm user\'s email address with verification code'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email confirmed', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid code', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.ConfirmEmailDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)('social/:provider'),
    (0, swagger_1.ApiParam)({
        name: 'provider',
        enum: ['google', 'facebook', 'apple'],
        description: 'Social provider name'
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Social authentication',
        description: 'Authenticate user via social provider (Google, Facebook, etc.)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Social login successful',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid token or provider', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.SocialAuthDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "social", null);
__decorate([
    (0, common_1.Get)('user/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user',
        description: 'Get authenticated user information'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved', type: responses_1.UserProfileResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __param(9, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [create_user_use_case_1.CreateUserUseCase,
        login_user_use_case_1.LoginUserUseCase,
        logout_user_use_case_1.LogoutUserUseCase,
        reset_password_use_case_1.ResetPasswordUseCase,
        confirm_email_use_case_1.ConfirmEmailUseCase,
        send_confirmation_code_use_case_1.SendConfirmationCodeUseCase,
        social_auth_use_case_1.SocialAuthUseCase,
        jwt_1.JwtService,
        redis_service_1.RedisService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map