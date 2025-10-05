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
exports.LocalFileStorageService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let LocalFileStorageService = class LocalFileStorageService {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        this.chunkedPath = (0, path_1.join)(this.uploadPath, 'chunked');
        this.tempChunksPath = (0, path_1.join)(this.uploadPath, 'temp-chunks');
        this.ensureDirectoriesExist();
    }
    async ensureDirectoriesExist() {
        const paths = [this.uploadPath, this.chunkedPath, this.tempChunksPath];
        for (const path of paths) {
            try {
                await fs_1.promises.access(path);
            }
            catch {
                await fs_1.promises.mkdir(path, { recursive: true });
            }
        }
    }
    async createFile(params) {
        const uploadPath = (0, path_1.join)(this.chunkedPath, params.filename);
        await fs_1.promises.writeFile(uploadPath, Buffer.alloc(0));
        const tempChunkDir = (0, path_1.join)(this.tempChunksPath, params.fileId);
        await fs_1.promises.mkdir(tempChunkDir, { recursive: true });
    }
    async uploadChunk(fileId, chunkData, chunkIndex) {
        const tempChunkDir = (0, path_1.join)(this.tempChunksPath, fileId);
        const chunkFilePath = (0, path_1.join)(tempChunkDir, `chunk-${chunkIndex.toString().padStart(6, '0')}`);
        await fs_1.promises.writeFile(chunkFilePath, chunkData);
    }
    async assembleChunks(fileId, totalChunks, finalFilename) {
        const tempChunkDir = (0, path_1.join)(this.tempChunksPath, fileId);
        const finalFilePath = (0, path_1.join)(this.chunkedPath, finalFilename);
        try {
            const chunkFiles = await fs_1.promises.readdir(tempChunkDir);
            const sortedChunkFiles = chunkFiles
                .filter(file => file.startsWith('chunk-'))
                .sort((a, b) => {
                const indexA = parseInt(a.replace('chunk-', ''));
                const indexB = parseInt(b.replace('chunk-', ''));
                return indexA - indexB;
            });
            if (sortedChunkFiles.length !== totalChunks) {
                throw new Error(`Missing chunks. Expected: ${totalChunks}, Found: ${sortedChunkFiles.length}`);
            }
            const writeStream = await fs_1.promises.open(finalFilePath, 'w');
            for (const chunkFile of sortedChunkFiles) {
                const chunkPath = (0, path_1.join)(tempChunkDir, chunkFile);
                const chunkData = await fs_1.promises.readFile(chunkPath);
                await writeStream.write(chunkData);
            }
            await writeStream.close();
            await this.cleanup(fileId);
        }
        catch (error) {
            await this.cleanup(fileId);
            throw error;
        }
    }
    async deleteFile(fileId, filename) {
        if (filename) {
            try {
                const filePath = (0, path_1.join)(this.chunkedPath, filename);
                await fs_1.promises.unlink(filePath);
            }
            catch (error) {
                console.warn(`Failed to delete final file: ${filename}`, error);
            }
        }
        await this.cleanup(fileId);
    }
    async cleanup(fileId) {
        const tempChunkDir = (0, path_1.join)(this.tempChunksPath, fileId);
        try {
            await fs_1.promises.rm(tempChunkDir, { recursive: true, force: true });
        }
        catch (error) {
            console.warn(`Failed to cleanup temp chunks for file ${fileId}:`, error);
        }
    }
    getFileUrl(filename) {
        return `/storage/chunked/${filename}`;
    }
};
exports.LocalFileStorageService = LocalFileStorageService;
exports.LocalFileStorageService = LocalFileStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalFileStorageService);
//# sourceMappingURL=local-file-storage.service.js.map