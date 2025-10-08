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
exports.ChatMemberResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChatMemberResponseDto {
}
exports.ChatMemberResponseDto = ChatMemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1member123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1chat123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1user123456' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'member' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ChatMemberResponseDto.prototype, "joinedAt", void 0);
//# sourceMappingURL=chat-member-response.dto.js.map