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
exports.HealthResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class HealthResponseDto {
}
exports.HealthResponseDto = HealthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ok' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-10-04T10:21:42.177Z' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 125.960380934 }),
    __metadata("design:type", Number)
], HealthResponseDto.prototype, "uptime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        properties: {
            rss: { type: 'number', example: 131166208 },
            heapTotal: { type: 'number', example: 45330432 },
            heapUsed: { type: 'number', example: 39939072 },
            external: { type: 'number', example: 20819384 },
            arrayBuffers: { type: 'number', example: 18320745 }
        }
    }),
    __metadata("design:type", Object)
], HealthResponseDto.prototype, "memory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'v22.20.0' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'development' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "environment", void 0);
//# sourceMappingURL=health-response.dto.js.map