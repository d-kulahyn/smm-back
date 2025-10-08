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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserToChatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const index_1 = require("../../../../domain/enums/index");
class AddUserToChatDto {
}
exports.AddUserToChatDto = AddUserToChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID to add to chat' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddUserToChatDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.ChatMemberRole, description: 'User role in chat', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.ChatMemberRole),
    __metadata("design:type", typeof (_a = typeof index_1.ChatMemberRole !== "undefined" && index_1.ChatMemberRole) === "function" ? _a : Object)
], AddUserToChatDto.prototype, "role", void 0);
//# sourceMappingURL=add-user-to-chat.dto.js.map