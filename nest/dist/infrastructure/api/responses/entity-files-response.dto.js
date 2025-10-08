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
exports.EntityFilesResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const file_create_response_dto_1 = require("./file-create-response.dto");
class EntityFilesResponseDto {
}
exports.EntityFilesResponseDto = EntityFilesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [file_create_response_dto_1.FileCreateResponseDto] }),
    __metadata("design:type", Array)
], EntityFilesResponseDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], EntityFilesResponseDto.prototype, "total", void 0);
//# sourceMappingURL=entity-files-response.dto.js.map