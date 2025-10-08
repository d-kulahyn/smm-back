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
exports.ChunkUploadResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChunkUploadResponseDto {
}
exports.ChunkUploadResponseDto = ChunkUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1file123456' }),
    __metadata("design:type", String)
], ChunkUploadResponseDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ChunkUploadResponseDto.prototype, "chunksUploaded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ChunkUploadResponseDto.prototype, "isComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chunk uploaded successfully' }),
    __metadata("design:type", String)
], ChunkUploadResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], ChunkUploadResponseDto.prototype, "chunkIndex", void 0);
//# sourceMappingURL=chunk-upload-response.dto.js.map