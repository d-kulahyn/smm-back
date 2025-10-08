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
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const chunked_file_service_1 = require("../../../application/services/chunked-file.service");
const requests_1 = require("../requests");
const responses_1 = require("../responses");
let StorageController = class StorageController {
    constructor(chunkedFileService) {
        this.chunkedFileService = chunkedFileService;
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
    }
    async createFile(createFileDto, req) {
        try {
            const userId = req.user.userId;
            const fileEntity = await this.chunkedFileService.createFile({
                originalName: createFileDto.originalName,
                mimeType: createFileDto.mimeType,
                size: createFileDto.size,
                entityType: createFileDto.entityType,
                entityId: createFileDto.entityId,
                uploadedBy: userId,
                totalChunks: createFileDto.totalChunks,
            });
            return {
                fileId: fileEntity.id,
                filename: fileEntity.filename,
                uploadUrl: `/storage/chunked/${fileEntity.id}`,
                isComplete: fileEntity.isComplete,
                chunksUploaded: fileEntity.chunks,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to create file');
        }
    }
    async uploadFileChunk(fileId, file, req) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No chunk data provided. Please send file data in "chunk" field.');
            }
            const updatedFile = await this.chunkedFileService.uploadChunk(fileId, file.buffer);
            return {
                fileId: updatedFile.id,
                chunksUploaded: updatedFile.chunks,
                isComplete: updatedFile.isComplete,
                message: 'Chunk uploaded successfully',
                chunkIndex: 0,
            };
        }
        catch (error) {
            if (error.message === 'File not found') {
                throw new common_1.NotFoundException('File not found');
            }
            throw new common_1.BadRequestException(error.message || 'Failed to upload chunk');
        }
    }
    async uploadFileChunkFlexible(fileId, req, res) {
        try {
            const multer = require('multer');
            const upload = multer({
                limits: {
                    fileSize: 50 * 1024 * 1024,
                },
                fileFilter: (req, file, callback) => {
                    callback(null, true);
                }
            }).any();
            return new Promise((resolve, reject) => {
                upload(req, res, async (err) => {
                    if (err) {
                        return reject(new common_1.BadRequestException(`Upload error: ${err.message}`));
                    }
                    if (!req.files || req.files.length === 0) {
                        return reject(new common_1.BadRequestException('No file data provided'));
                    }
                    try {
                        const file = req.files[0];
                        const updatedFile = await this.chunkedFileService.uploadChunk(fileId, file.buffer);
                        const response = {
                            fileId: updatedFile.id,
                            chunksUploaded: updatedFile.chunks,
                            isComplete: updatedFile.isComplete,
                            message: 'Chunk uploaded successfully',
                        };
                        res.status(201).json(response);
                        resolve(response);
                    }
                    catch (error) {
                        if (error.message === 'File not found') {
                            reject(new common_1.NotFoundException('File not found'));
                        }
                        else {
                            reject(new common_1.BadRequestException(error.message || 'Failed to upload chunk'));
                        }
                    }
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to upload chunk');
        }
    }
    async completeFileUpload(fileId, req) {
        try {
            const completedFile = await this.chunkedFileService.completeUpload(fileId);
            return {
                fileId: completedFile.id,
                isComplete: completedFile.isComplete,
                downloadUrl: `/storage/chunked/${completedFile.filename}`,
                message: 'File upload completed successfully',
            };
        }
        catch (error) {
            if (error.message === 'File not found') {
                throw new common_1.NotFoundException('File not found');
            }
            throw new common_1.BadRequestException(error.message || 'Failed to complete upload');
        }
    }
    async getChunkedFile(filename, res) {
        try {
            const filePath = (0, path_1.join)(this.uploadPath, 'chunked', filename);
            if (!(0, fs_1.existsSync)(filePath)) {
                throw new common_1.NotFoundException('File not found');
            }
            const mimeType = this.getMimeType(filename);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            if (!mimeType.startsWith('image/') && !mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            }
            return res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException('File not found');
        }
    }
    async getFilesByEntity(entityType, entityId) {
        try {
            const files = await this.chunkedFileService.getFilesByEntity(entityType, entityId);
            const fileResponses = files.map(file => ({
                fileId: file.id,
                filename: file.filename,
                uploadUrl: `/storage/chunked/${file.filename}`,
                isComplete: file.isComplete,
                chunksUploaded: file.chunks,
            }));
            return {
                files: fileResponses,
                total: files.length,
            };
        }
        catch (error) {
            throw new common_1.NotFoundException('Entity not found');
        }
    }
    async uploadFileChunkWithIndex(fileId, chunkIndexStr, file, req) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No chunk data provided. Please send file data in "chunk" field.');
            }
            const chunkIndex = parseInt(chunkIndexStr, 10);
            if (isNaN(chunkIndex) || chunkIndex < 0) {
                throw new common_1.BadRequestException('Invalid chunk index. Must be a non-negative integer.');
            }
            const updatedFile = await this.chunkedFileService.uploadChunk(fileId, file.buffer, chunkIndex);
            return {
                fileId: updatedFile.id,
                chunksUploaded: updatedFile.chunks,
                isComplete: updatedFile.isComplete,
                message: 'Chunk uploaded successfully',
                chunkIndex: chunkIndex,
            };
        }
        catch (error) {
            if (error.message === 'File not found') {
                throw new common_1.NotFoundException('File not found');
            }
            throw new common_1.BadRequestException(error.message || 'Failed to upload chunk');
        }
    }
    async getChunkInfo(fileId, req) {
        try {
            const chunkInfo = await this.chunkedFileService.getChunkInfo(fileId);
            return {
                fileId: chunkInfo.fileId,
                totalChunks: chunkInfo.totalChunks,
                chunksUploaded: chunkInfo.uploadedChunks || 0,
                uploadedChunkIndexes: chunkInfo.uploadedChunkIndexes || [],
                isComplete: chunkInfo.isComplete
            };
        }
        catch (error) {
            if (error.message === 'File not found') {
                throw new common_1.NotFoundException('File not found');
            }
            throw new common_1.BadRequestException(error.message || 'Failed to get chunk info');
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
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create empty file for chunked upload',
        description: 'Create an empty file with metadata for chunked upload'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File created successfully',
        type: responses_1.FileCreateResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.CreateFileDto, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "createFile", null);
__decorate([
    (0, common_1.Post)('chunked/:fileId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload file chunk',
        description: 'Upload a chunk of a file (for large files). Send file data in "chunk" field.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: responses_1.ChunkUploadResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('chunk', {
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            callback(null, true);
        }
    })),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFileChunk", null);
__decorate([
    (0, common_1.Post)('upload/:fileId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload file chunk (flexible)',
        description: 'Upload a chunk of a file with flexible field name. Accepts any file field name.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: responses_1.ChunkUploadResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFileChunkFlexible", null);
__decorate([
    (0, common_1.Post)('complete/:fileId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Complete file upload',
        description: 'Complete the upload of a chunked file'
    }),
    (0, swagger_1.ApiParam)({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File upload completed successfully',
        type: responses_1.FileCompleteResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "completeFileUpload", null);
__decorate([
    (0, common_1.Get)('chunked/:filename'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chunked file',
        description: 'Serve chunked uploaded files'
    }),
    (0, swagger_1.ApiParam)({
        name: 'filename',
        description: 'Chunked file name',
        example: '1696420398754-abc123-document.pdf'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File served successfully',
        schema: {
            type: 'string',
            format: 'binary',
            description: 'File content'
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getChunkedFile", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get files by entity',
        description: 'Get all files attached to an entity'
    }),
    (0, swagger_1.ApiParam)({
        name: 'entityType',
        description: 'Type of the entity (e.g., project, task)',
        example: 'project'
    }),
    (0, swagger_1.ApiParam)({
        name: 'entityId',
        description: 'ID of the entity',
        example: 'clm1project123456'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Files retrieved successfully',
        type: responses_1.EntityFilesResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Entity not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Entity not found' }
            }
        }
    }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getFilesByEntity", null);
__decorate([
    (0, common_1.Post)('chunk/:fileId/:chunkIndex'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload file chunk with index',
        description: 'Upload a specific chunk by index for parallel uploads. Chunks can be uploaded in any order.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    }),
    (0, swagger_1.ApiParam)({
        name: 'chunkIndex',
        description: 'Chunk index (0-based)',
        example: '0'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: responses_1.ChunkUploadResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('chunk', {
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            callback(null, true);
        }
    })),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Param)('chunkIndex')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFileChunkWithIndex", null);
__decorate([
    (0, common_1.Get)('info/:fileId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chunk upload info',
        description: 'Get information about chunk upload progress including missing chunks'
    }),
    (0, swagger_1.ApiParam)({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chunk info retrieved successfully',
        type: responses_1.ChunkInfoResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found'
    }),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getChunkInfo", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('Storage'),
    (0, common_1.Controller)('storage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, shared_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chunked_file_service_1.ChunkedFileService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map