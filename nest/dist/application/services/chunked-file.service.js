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
exports.ChunkedFileService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const file_entity_1 = require("../../domain/entities/file.entity");
let ChunkedFileService = class ChunkedFileService {
    constructor(fileRepository, fileStorageService) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
    }
    async createFile(params) {
        const fileId = (0, uuid_1.v4)();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${params.originalName}`;
        await this.fileStorageService.createFile({
            fileId,
            filename,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size,
            entityType: params.entityType,
            entityId: params.entityId,
            uploadedBy: params.uploadedBy,
            totalChunks: params.totalChunks,
        });
        const fileEntity = file_entity_1.FileEntity.create({
            id: fileId,
            filename,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size,
            uploadPath: filename,
            entityType: params.entityType,
            entityId: params.entityId,
            uploadedBy: params.uploadedBy,
            totalChunks: params.totalChunks,
        });
        return await this.fileRepository.create(fileEntity);
    }
    async uploadChunk(fileId, chunkData, chunkIndex) {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }
        if (fileEntity.isComplete) {
            throw new Error('File upload is already complete');
        }
        const actualChunkIndex = chunkIndex !== undefined ? chunkIndex : fileEntity.chunks;
        if (chunkIndex !== undefined) {
            const isAlreadyUploaded = await this.fileRepository.isChunkUploaded(fileId, chunkIndex);
            if (isAlreadyUploaded) {
                throw new Error(`Chunk ${chunkIndex} is already uploaded`);
            }
        }
        await this.fileStorageService.uploadChunk(fileId, chunkData, actualChunkIndex);
        const updatedFile = await this.fileRepository.markChunkUploaded(fileId, actualChunkIndex);
        if (updatedFile.totalChunks && updatedFile.chunks >= updatedFile.totalChunks) {
            return await this.assembleFile(fileId);
        }
        return updatedFile;
    }
    async assembleFile(fileId) {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }
        if (!fileEntity.totalChunks) {
            throw new Error('Cannot assemble file without totalChunks specified');
        }
        try {
            await this.fileStorageService.assembleChunks(fileId, fileEntity.totalChunks, fileEntity.filename);
            return await this.fileRepository.markComplete(fileId);
        }
        catch (error) {
            await this.fileStorageService.cleanup(fileId);
            throw error;
        }
    }
    async completeUpload(fileId) {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }
        if (fileEntity.isComplete) {
            return fileEntity;
        }
        if (fileEntity.totalChunks) {
            if (fileEntity.chunks < fileEntity.totalChunks) {
                throw new Error(`Not all chunks uploaded. Expected: ${fileEntity.totalChunks}, Received: ${fileEntity.chunks}`);
            }
            return await this.assembleFile(fileId);
        }
        throw new Error('Cannot complete upload without totalChunks specified');
    }
    async deleteFile(fileId) {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }
        await this.fileStorageService.deleteFile(fileId, fileEntity.filename);
        await this.fileRepository.delete(fileId);
    }
    async getFilesByEntity(entityType, entityId) {
        return await this.fileRepository.findByEntityId(entityType, entityId);
    }
    getFileUrl(filename) {
        return this.fileStorageService.getFileUrl(filename);
    }
    async getChunkInfo(fileId) {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }
        const uploadedChunkIndexes = await this.fileRepository.getUploadedChunks(fileId);
        const missingChunks = await this.fileRepository.getMissingChunks(fileId);
        return {
            fileId: fileEntity.id,
            totalChunks: fileEntity.totalChunks,
            uploadedChunks: fileEntity.chunks,
            isComplete: fileEntity.isComplete,
            missingChunks: missingChunks.length > 0 ? missingChunks : undefined,
            uploadedChunkIndexes,
        };
    }
};
exports.ChunkedFileService = ChunkedFileService;
exports.ChunkedFileService = ChunkedFileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FILE_REPOSITORY')),
    __param(1, (0, common_1.Inject)('FILE_STORAGE_SERVICE')),
    __metadata("design:paramtypes", [Object, Object])
], ChunkedFileService);
//# sourceMappingURL=chunked-file.service.js.map