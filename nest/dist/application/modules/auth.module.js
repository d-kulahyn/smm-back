"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = exports.USER_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("../../infrastructure/api/controllers/auth.controller");
const create_user_use_case_1 = require("../use-cases/create-user.use-case");
const login_user_use_case_1 = require("../use-cases/login-user.use-case");
const logout_user_use_case_1 = require("../use-cases/logout-user.use-case");
const reset_password_use_case_1 = require("../use-cases/reset-password.use-case");
const confirm_email_use_case_1 = require("../use-cases/confirm-email.use-case");
const send_confirmation_code_use_case_1 = require("../use-cases/send-confirmation-code.use-case");
const social_auth_use_case_1 = require("../use-cases/social-auth.use-case");
const get_current_user_use_case_1 = require("../use-cases/get-current-user.use-case");
const prisma_user_repository_1 = require("../../infrastructure/repositories/prisma-user.repository");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const redis_service_1 = require("../../infrastructure/services/redis.service");
const jwt_strategy_1 = require("../../shared/strategies/jwt.strategy");
const auth_service_1 = require("../../shared/services/auth.service");
exports.USER_REPOSITORY = 'USER_REPOSITORY';
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            create_user_use_case_1.CreateUserUseCase,
            login_user_use_case_1.LoginUserUseCase,
            logout_user_use_case_1.LogoutUserUseCase,
            reset_password_use_case_1.ResetPasswordUseCase,
            confirm_email_use_case_1.ConfirmEmailUseCase,
            send_confirmation_code_use_case_1.SendConfirmationCodeUseCase,
            social_auth_use_case_1.SocialAuthUseCase,
            get_current_user_use_case_1.GetCurrentUserUseCase,
            jwt_strategy_1.JwtStrategy,
            prisma_service_1.PrismaService,
            redis_service_1.RedisService,
            auth_service_1.AuthService,
            {
                provide: exports.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map