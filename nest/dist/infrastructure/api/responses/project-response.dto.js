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
exports.ProjectResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectResponseDto {
}
exports.ProjectResponseDto = ProjectResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1abc123def456' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Project' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project description', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1owner123456' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000, nullable: true }),
    __metadata("design:type", Number)
], ProjectResponseDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'avatar.jpg', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FF5733', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=project-response.dto.js.map