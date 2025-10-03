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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const swagger_1 = require("@nestjs/swagger");
let StorageController = class StorageController {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
    }
    async getAvatar(filename, res) {
        try {
            const filePath = (0, path_1.join)(this.uploadPath, 'avatars', filename);
            if (!(0, fs_1.existsSync)(filePath)) {
                throw new common_1.NotFoundException('File not found');
            }
            const mimeType = this.getMimeType(filename);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException('Avatar not found');
        }
    }
    async getTaskAttachment(filename, res) {
        try {
            const filePath = (0, path_1.join)(this.uploadPath, 'tasks', filename);
            if (!(0, fs_1.existsSync)(filePath)) {
                throw new common_1.NotFoundException('File not found');
            }
            const mimeType = this.getMimeType(filename);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            if (!mimeType.startsWith('image/')) {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            }
            return res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException('File not found');
        }
    }
    getMimeType(filename) {
        const extension = filename.split('.').pop()?.toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
        };
        return mimeTypes[extension || ''] || 'application/octet-stream';
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Get)('avatars/:filename'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get avatar file',
        description: 'Serve avatar image files'
    }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)('tasks/:filename'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get task attachment file',
        description: 'Serve task attachment files'
    }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getTaskAttachment", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('storage'),
    (0, common_1.Controller)('storage')
], StorageController);
//# sourceMappingURL=storage.controller.js.map