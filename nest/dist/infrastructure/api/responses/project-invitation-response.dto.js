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
exports.ProjectInvitationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectInvitationResponseDto {
}
exports.ProjectInvitationResponseDto = ProjectInvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1invite123def456' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123token456' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1project123456' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "invitedEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'member' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    __metadata("design:type", Array)
], ProjectInvitationResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31T23:59:59.000Z' }),
    __metadata("design:type", String)
], ProjectInvitationResponseDto.prototype, "expiresAt", void 0);
//# sourceMappingURL=project-invitation-response.dto.js.map