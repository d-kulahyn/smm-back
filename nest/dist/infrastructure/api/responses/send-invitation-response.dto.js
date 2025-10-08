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
exports.SendInvitationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const project_invitation_response_dto_1 = require("./project-invitation-response.dto");
class SendInvitationResponseDto {
}
exports.SendInvitationResponseDto = SendInvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Invitation sent successfully' }),
    __metadata("design:type", String)
], SendInvitationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: project_invitation_response_dto_1.ProjectInvitationResponseDto }),
    __metadata("design:type", project_invitation_response_dto_1.ProjectInvitationResponseDto)
], SendInvitationResponseDto.prototype, "invitation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether email was sent' }),
    __metadata("design:type", Boolean)
], SendInvitationResponseDto.prototype, "emailSent", void 0);
//# sourceMappingURL=send-invitation-response.dto.js.map