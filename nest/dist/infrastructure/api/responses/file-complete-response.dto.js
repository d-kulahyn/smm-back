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
exports.FileCompleteResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FileCompleteResponseDto {
}
exports.FileCompleteResponseDto = FileCompleteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1file123456' }),
    __metadata("design:type", String)
], FileCompleteResponseDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], FileCompleteResponseDto.prototype, "isComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/storage/chunked/1696420398754-abc123-document.pdf' }),
    __metadata("design:type", String)
], FileCompleteResponseDto.prototype, "downloadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'File upload completed successfully' }),
    __metadata("design:type", String)
], FileCompleteResponseDto.prototype, "message", void 0);
//# sourceMappingURL=file-complete-response.dto.js.map