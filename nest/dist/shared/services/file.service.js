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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let FileService = class FileService {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        this.avatarsPath = (0, path_1.join)(this.uploadPath, 'avatars');
        this.tasksPath = (0, path_1.join)(this.uploadPath, 'tasks');
        this.ensureDirectoriesExist();
    }
    async ensureDirectoriesExist() {
        const paths = [this.uploadPath, this.avatarsPath, this.tasksPath];
        for (const path of paths) {
            try {
                await fs_1.promises.access(path);
            }
            catch {
                await fs_1.promises.mkdir(path, { recursive: true });
            }
        }
    }
    async saveAvatar(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Only image files are allowed for avatars');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Avatar file size must be less than 5MB');
        }
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
        const filePath = (0, path_1.join)(this.uploadPath, 'avatars', fileName);
        await fs_1.promises.writeFile(filePath, file.buffer);
        return fileName;
    }
    async deleteAvatar(avatarPath) {
        if (!avatarPath)
            return;
        try {
            const fullPath = (0, path_1.join)(this.uploadPath, avatarPath);
            await fs_1.promises.unlink(fullPath);
        }
        catch (error) {
            console.warn(`Failed to delete avatar file: ${avatarPath}`, error);
        }
    }
    async saveTaskAttachment(file) {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/zip', 'application/x-rar-compressed'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('File type not allowed');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size must be less than 10MB');
        }
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
        const filePath = (0, path_1.join)(this.uploadPath, 'tasks', fileName);
        await fs_1.promises.writeFile(filePath, file.buffer);
        return {
            filePath: fileName,
            originalName: file.originalname
        };
    }
    async deleteTaskAttachment(filePath) {
        if (!filePath)
            return;
        try {
            const fullPath = (0, path_1.join)(this.tasksPath, filePath);
            await fs_1.promises.unlink(fullPath);
        }
        catch (error) {
            console.warn(`Failed to delete task attachment: ${filePath}`, error);
        }
    }
    getFileExtension(filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : 'jpg';
    }
    getAvatarUrl(avatarPath) {
        return `/storage/${avatarPath}`;
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileService);
//# sourceMappingURL=file.service.js.map