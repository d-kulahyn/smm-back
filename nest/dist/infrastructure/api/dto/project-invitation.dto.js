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
exports.PaginationDto = exports.AcceptProjectInvitationUseCaseDto = exports.SendProjectInvitationUseCaseDto = exports.SendProjectInvitationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class SendProjectInvitationDto {
}
exports.SendProjectInvitationDto = SendProjectInvitationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email of the user to invite',
        example: 'user@example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendProjectInvitationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in the project',
        enum: client_1.ProjectRole,
        example: client_1.ProjectRole.member
    }),
    (0, class_validator_1.IsEnum)(client_1.ProjectRole),
    __metadata("design:type", String)
], SendProjectInvitationDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of permissions',
        type: [String],
        example: ['read', 'write']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SendProjectInvitationDto.prototype, "permissions", void 0);
class SendProjectInvitationUseCaseDto {
}
exports.SendProjectInvitationUseCaseDto = SendProjectInvitationUseCaseDto;
class AcceptProjectInvitationUseCaseDto {
}
exports.AcceptProjectInvitationUseCaseDto = AcceptProjectInvitationUseCaseDto;
class PaginationDto {
    constructor() {
        this.page = 1;
        this.perPage = 15;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PaginationDto.prototype, "perPage", void 0);
//# sourceMappingURL=project-invitation.dto.js.map