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
exports.ConfirmEmailUseCase = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../infrastructure/services/redis.service");
let ConfirmEmailUseCase = class ConfirmEmailUseCase {
    constructor(userRepository, redisService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
    }
    async execute(email, code) {
        const storedCode = await this.redisService.get(`email_confirmation:${email}`);
        if (!storedCode || storedCode !== code) {
            throw new Error('Invalid or expired confirmation code');
        }
        await this.userRepository.confirmEmail(email);
        await this.redisService.del(`email_confirmation:${email}`);
    }
};
exports.ConfirmEmailUseCase = ConfirmEmailUseCase;
exports.ConfirmEmailUseCase = ConfirmEmailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], ConfirmEmailUseCase);
//# sourceMappingURL=confirm-email.use-case.js.map