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
exports.HealthController = exports.HealthResponseDto = void 0;
const common_1 = require("@nestjs/common");
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
let HealthController = class HealthController {
    constructor() {
        console.log('HealthController');
    }
    check() {
        console.log('Health check endpoint');
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
            environment: process.env.NODE_ENV || 'development'
        };
    }
    ready() {
        return {
            status: 'ready',
            timestamp: new Date().toISOString()
        };
    }
    live() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString()
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check endpoint',
        description: 'Returns the health status of the application'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health check successful',
        type: HealthResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({
        summary: 'Readiness check',
        description: 'Check if the application is ready to serve requests'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is ready',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                timestamp: { type: 'string' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "ready", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({
        summary: 'Liveness check',
        description: 'Check if the application is alive'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is alive',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                timestamp: { type: 'string' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [])
], HealthController);
//# sourceMappingURL=health.controller.js.map