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
exports.ChunkInfoResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChunkInfoResponseDto {
}
exports.ChunkInfoResponseDto = ChunkInfoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1file123456' }),
    __metadata("design:type", String)
], ChunkInfoResponseDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ChunkInfoResponseDto.prototype, "totalChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ChunkInfoResponseDto.prototype, "chunksUploaded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [0, 1, 2, 3, 4], type: [Number] }),
    __metadata("design:type", Array)
], ChunkInfoResponseDto.prototype, "uploadedChunkIndexes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ChunkInfoResponseDto.prototype, "isComplete", void 0);
//# sourceMappingURL=chunk-info-response.dto.js.map