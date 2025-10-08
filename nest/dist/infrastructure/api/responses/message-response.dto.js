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
exports.MessageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const message_sender_response_dto_1 = require("./message-sender-response.dto");
class MessageResponseDto {
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1msg123def456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello everyone!' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'text' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1chat123456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1sender123456' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'file-path.jpg', nullable: true }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the message is read by current user' }),
    __metadata("design:type", Boolean)
], MessageResponseDto.prototype, "isReadByCurrentUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: message_sender_response_dto_1.MessageSenderResponseDto, description: 'Message sender information', nullable: true }),
    __metadata("design:type", message_sender_response_dto_1.MessageSenderResponseDto)
], MessageResponseDto.prototype, "sender", void 0);
//# sourceMappingURL=message-response.dto.js.map