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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendConfirmationCodeUseCase = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../infrastructure/services/redis.service");
let SendConfirmationCodeUseCase = class SendConfirmationCodeUseCase {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async execute(email) {
        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.set(`email_verification:${email}`, confirmationCode, 10 * 60);
        console.log(`Email verification code for ${email}: ${confirmationCode}`);
        return confirmationCode;
    }
};
exports.SendConfirmationCodeUseCase = SendConfirmationCodeUseCase;
exports.SendConfirmationCodeUseCase = SendConfirmationCodeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], SendConfirmationCodeUseCase);
//# sourceMappingURL=send-confirmation-code.use-case.js.map