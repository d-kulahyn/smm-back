import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Res,
    NotFoundException,
    Body,
    UseGuards,
    Request,
    UploadedFile,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import {Response} from 'express';
import {join, resolve} from 'path';
import {existsSync} from 'fs';
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {JwtAuthGuard} from '../../../shared/guards/jwt-auth.guard';
import {AuthenticatedRequest, PermissionsGuard} from '../../../shared';
import {ChunkedFileService} from '../../../application/services/chunked-file.service';

// Request DTOs
import {
    CreateFileDto,
} from '../requests';

// Response DTOs
import {
    FileCreateResponseDto,
    ChunkUploadResponseDto,
    ChunkInfoResponseDto,
    FileCompleteResponseDto,
    EntityFilesResponseDto,
    ErrorResponseDto
} from '../responses';

// Mime types enum and extension map
export enum MimeTypeEnum {
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    IMAGE_GIF = 'image/gif',
    IMAGE_WEBP = 'image/webp',
    APPLICATION_PDF = 'application/pdf',
    APPLICATION_MSWORD = 'application/msword',
    APPLICATION_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    APPLICATION_XLS = 'application/vnd.ms-excel',
    APPLICATION_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    TEXT_PLAIN = 'text/plain',
    APPLICATION_ZIP = 'application/zip',
    APPLICATION_RAR = 'application/x-rar-compressed',
}

const EXTENSION_MIME_MAP: { [key: string]: string } = {
    jpg: MimeTypeEnum.IMAGE_JPEG,
    jpeg: MimeTypeEnum.IMAGE_JPEG,
    png: MimeTypeEnum.IMAGE_PNG,
    gif: MimeTypeEnum.IMAGE_GIF,
    webp: MimeTypeEnum.IMAGE_WEBP,
    pdf: MimeTypeEnum.APPLICATION_PDF,
    doc: MimeTypeEnum.APPLICATION_MSWORD,
    docx: MimeTypeEnum.APPLICATION_DOCX,
    xls: MimeTypeEnum.APPLICATION_XLS,
    xlsx: MimeTypeEnum.APPLICATION_XLSX,
    txt: MimeTypeEnum.TEXT_PLAIN,
    zip: MimeTypeEnum.APPLICATION_ZIP,
    rar: MimeTypeEnum.APPLICATION_RAR,
};

@ApiTags('Storage')
@Controller('storage')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class StorageController {
    private readonly uploadPath = join(process.cwd(), 'uploads');

    constructor(
        private readonly chunkedFileService: ChunkedFileService
    ) {
    }

    @Post('create')
    @ApiOperation({
        summary: 'Create empty file for chunked upload',
        description: 'Create an empty file with metadata for chunked upload'
    })
    @ApiResponse({
        status: 201,
        description: 'File created successfully',
        type: FileCreateResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data'
    })
    async createFile(
        @Body() createFileDto: CreateFileDto,
        @Request() req: AuthenticatedRequest
    ): Promise<FileCreateResponseDto> {
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
                fileGroupId: createFileDto.fileGroupId,
                uploadPath: createFileDto.uploadPath,
                deviceId: createFileDto.deviceId,
            });

            return {
                fileId: fileEntity.id,
                filename: fileEntity.filename,
                uploadUrl: `/storage/chunked/${fileEntity.uploadPath}`,
                isComplete: fileEntity.isComplete,
                chunksUploaded: fileEntity.chunks,
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create file');
        }
    }

    @Post('chunked/:fileId')
    @ApiOperation({
        summary: 'Upload file chunk',
        description: 'Upload a chunk of a file (for large files). Send file data in "chunk" field.'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: ChunkUploadResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data'
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    @UseInterceptors(FileInterceptor('chunk', {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB chunk limit
        },
        fileFilter: (req, file, callback) => {
            callback(null, true);
        }
    }))
    async uploadFileChunk(
        @Param('fileId') fileId: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: AuthenticatedRequest
    ): Promise<ChunkUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('No chunk data provided. Please send file data in "chunk" field.');
            }

            const updatedFile = await this.chunkedFileService.uploadChunk(
                fileId,
                file.buffer
            );

            return {
                fileId: updatedFile.id,
                chunksUploaded: updatedFile.chunks,
                isComplete: updatedFile.isComplete,
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to upload chunk');
        }
    }

    @Post('upload/:fileId')
    @ApiOperation({
        summary: 'Upload file chunk (flexible)',
        description: 'Upload a chunk of a file with flexible field name. Accepts any file field name.'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: ChunkUploadResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data'
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    async uploadFileChunkFlexible(
        @Param('fileId') fileId: string,
        @Request() req: any,
        @Res() res: Response
    ) {
        try {
            const multer = require('multer');
            const upload = multer({
                limits: {
                    fileSize: 50 * 1024 * 1024, // 50MB chunk limit
                },
                fileFilter: (req: any, file: any, callback: (arg0: null, arg1: boolean) => void) => {
                    callback(null, true);
                }
            }).any();

            return new Promise((resolve, reject) => {
                upload(req, res, async (err) => {
                    if (err) {
                        return reject(new BadRequestException(`Upload error: ${err.message}`));
                    }

                    if (!req.files || req.files.length === 0) {
                        return reject(new BadRequestException('No file data provided'));
                    }

                    try {
                        const file = req.files[0];
                        const updatedFile = await this.chunkedFileService.uploadChunk(
                            fileId,
                            file.buffer
                        );

                        const response = {
                            fileId: updatedFile.id,
                            chunksUploaded: updatedFile.chunks,
                            isComplete: updatedFile.isComplete,
                        };

                        res.status(201).json(response);
                        resolve(response);
                    } catch (error) {
                        if (error.message === 'File not found') {
                            reject(new NotFoundException('File not found'));
                        } else {
                            reject(new BadRequestException(error.message || 'Failed to upload chunk'));
                        }
                    }
                });
            });
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to upload chunk');
        }
    }

    @Post('complete/:fileId')
    @ApiOperation({
        summary: 'Complete file upload',
        description: 'Complete the upload of a chunked file'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    })
    @ApiResponse({
        status: 201,
        description: 'File upload completed successfully',
        type: FileCompleteResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data'
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    async completeFileUpload(
        @Param('fileId') fileId: string,
        @Request() req: AuthenticatedRequest
    ): Promise<FileCompleteResponseDto> {
        try {
            const completedFile = await this.chunkedFileService.completeUpload(fileId);

            return {
                fileId: completedFile.id,
                isComplete: completedFile.isComplete,
                // use uploadPath (relative path including filename) for download URL
                downloadUrl: `/storage/chunked/${encodeURI(completedFile.uploadPath || completedFile.filename)}`,
                message: 'File upload completed successfully',
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to complete upload');
        }
    }

    @Get('chunked/*')
    @ApiOperation({
        summary: 'Get chunked file',
        description: 'Serve chunked uploaded files'
    })
    @ApiParam({
        name: 'filename',
        description: 'Chunked file name or relative path',
        example: '1696420398754-abc123-document.pdf'
    })
    @ApiResponse({
        status: 200,
        description: 'File served successfully',
        schema: {
            type: 'string',
            format: 'binary',
            description: 'File content'
        }
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    async getChunkedFile(@Request() req: any, @Res() res: Response) {
        try {
            // wildcard param is in req.params[0]
            const raw = req.params && (req.params[0] || req.params.filename);
            if (!raw) {
                throw new NotFoundException('File not found');
            }

            // decode URI components and normalize
            const filename = decodeURIComponent(raw);

            const chunkedDir = resolve(this.uploadPath, 'chunked');
            const filePath = resolve(chunkedDir, filename);

            // Prevent path traversal: ensure filePath is inside chunkedDir using relative path
            const relative = require('path').relative(chunkedDir, filePath);
            if (relative.startsWith('..') || require('path').isAbsolute(relative)) {
                throw new NotFoundException('File not found');
            }

            if (!existsSync(filePath)) {
                throw new NotFoundException('File not found');
            }

            const mimeType = this.getMimeType(filename);

            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=86400');

            const baseName = filename.split('/').pop();
            if (!mimeType.startsWith('image/') && !mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
                res.setHeader('Content-Disposition', `attachment; filename="${baseName}"`);
            }

            return res.sendFile(filePath);
        } catch (error) {
            throw new NotFoundException('File not found');
        }
    }

    @Get('entity/:entityType/:entityId')
    @ApiOperation({
        summary: 'Get files by entity',
        description: 'Get all files attached to an entity'
    })
    @ApiParam({
        name: 'entityType',
        description: 'Type of the entity (e.g., project, task)',
        example: 'project'
    })
    @ApiParam({
        name: 'entityId',
        description: 'ID of the entity',
        example: 'clm1project123456'
    })
    @ApiResponse({
        status: 200,
        description: 'Files retrieved successfully',
        type: EntityFilesResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'Entity not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: {type: 'number', example: 404},
                message: {type: 'string', example: 'Entity not found'}
            }
        }
    })
    async getFilesByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId') entityId: string
    ): Promise<EntityFilesResponseDto> {
        try {
            const files = await this.chunkedFileService.getFilesByEntity(entityType, entityId);

            const fileResponses: FileCreateResponseDto[] = files.map(file => ({
                fileId: file.id,
                filename: file.filename,
                // use uploadPath to support nested paths
                uploadUrl: `/storage/chunked/${encodeURI(file.uploadPath || file.filename)}`,
                isComplete: file.isComplete,
                chunksUploaded: file.chunks,
            }));

            return {
                files: fileResponses,
                total: files.length,
            };
        } catch (error) {
            throw new NotFoundException('Entity not found');
        }
    }

    @Post('chunk/:fileId/:chunkIndex')
    @ApiOperation({
        summary: 'Upload file chunk with index',
        description: 'Upload a specific chunk by index for parallel uploads. Chunks can be uploaded in any order.'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    })
    @ApiParam({
        name: 'chunkIndex',
        description: 'Chunk index (0-based)',
        example: '0'
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Chunk uploaded successfully',
        type: ChunkUploadResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data'
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    @UseInterceptors(FileInterceptor('chunk', {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB chunk limit
        },
        fileFilter: (req, file, callback) => {
            callback(null, true);
        }
    }))
    async uploadFileChunkWithIndex(
        @Param('fileId') fileId: string,
        @Param('chunkIndex') chunkIndexStr: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: AuthenticatedRequest
    ): Promise<ChunkUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('No chunk data provided. Please send file data in "chunk" field.');
            }

            const chunkIndex = parseInt(chunkIndexStr, 10);
            if (isNaN(chunkIndex) || chunkIndex < 0) {
                throw new BadRequestException('Invalid chunk index. Must be a non-negative integer.');
            }

            const updatedFile = await this.chunkedFileService.uploadChunk(
                fileId,
                file.buffer,
                chunkIndex
            );

            return {
                fileId: updatedFile.id,
                chunksUploaded: updatedFile.chunks,
                isComplete: updatedFile.isComplete,
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to upload chunk');
        }
    }

    @Get('info/:fileId')
    @ApiOperation({
        summary: 'Get chunk upload info',
        description: 'Get information about chunk upload progress including missing chunks'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID',
        example: 'clm1file123456'
    })
    @ApiResponse({
        status: 200,
        description: 'Chunk info retrieved successfully',
        type: ChunkInfoResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'File not found'
    })
    async getChunkInfo(
        @Param('fileId') fileId: string,
        @Request() req: AuthenticatedRequest
    ): Promise<ChunkInfoResponseDto> {
        try {
            const chunkInfo = await this.chunkedFileService.getChunkInfo(fileId);

            // Маппим поля для соответствия DTO
            return {
                fileId: chunkInfo.fileId,
                totalChunks: chunkInfo.totalChunks,
                chunksUploaded: chunkInfo.uploadedChunks || 0, // маппим uploadedChunks в chunksUploaded
                uploadedChunkIndexes: chunkInfo.uploadedChunkIndexes || [],
                isComplete: chunkInfo.isComplete
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to get chunk info');
        }
    }

    @Post('files/:fileId/assign-to-group')
    @ApiOperation({
        summary: 'Assign file to group',
        description: 'Assign an existing file to a file group'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID to assign to group',
        example: 'clm1file123456'
    })
    @ApiResponse({
        status: 200,
        description: 'File assigned to group successfully',
        type: FileCreateResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'File or file group not found',
        type: ErrorResponseDto
    })
    @ApiResponse({
        status: 403,
        description: 'No permission to modify file or group',
        type: ErrorResponseDto
    })
    async assignFileToGroup(
        @Param('fileId') fileId: string,
        @Body() body: { fileGroupId: string },
        @Request() req: AuthenticatedRequest
    ) {
        const { AssignFileToGroupUseCase } = await import('../../../application/use-cases/manage-file-groups.use-case');
        const assignFileToGroupUseCase = new AssignFileToGroupUseCase(
            this.chunkedFileService['fileRepository'], // Accessing via service
            null // Will be injected properly in real implementation
        );

        const updatedFile = await assignFileToGroupUseCase.execute({
            fileId,
            fileGroupId: body.fileGroupId,
            userId: req.user.userId
        });

        return {
            success: true,
            message: 'File assigned to group successfully',
            data: {
                fileId: updatedFile.id,
                filename: updatedFile.filename,
                uploadUrl: updatedFile.uploadPath,
                isComplete: updatedFile.isComplete,
                chunksUploaded: updatedFile.chunks,
                totalChunks: updatedFile.totalChunks
            }
        };
    }

    @Delete('files/:fileId/remove-from-group')
    @ApiOperation({
        summary: 'Remove file from group',
        description: 'Remove a file from its current group'
    })
    @ApiParam({
        name: 'fileId',
        description: 'File ID to remove from group',
        example: 'clm1file123456'
    })
    @ApiResponse({
        status: 200,
        description: 'File removed from group successfully',
        type: FileCreateResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'File not found',
        type: ErrorResponseDto
    })
    @ApiResponse({
        status: 403,
        description: 'No permission to modify file',
        type: ErrorResponseDto
    })
    async removeFileFromGroup(
        @Param('fileId') fileId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const { RemoveFileFromGroupUseCase } = await import('../../../application/use-cases/manage-file-groups.use-case');
        const removeFileFromGroupUseCase = new RemoveFileFromGroupUseCase(
            this.chunkedFileService['fileRepository'] // Accessing via service
        );

        const updatedFile = await removeFileFromGroupUseCase.execute({
            fileId,
            userId: req.user.userId
        });

        return {
            success: true,
            message: 'File removed from group successfully',
            data: {
                fileId: updatedFile.id,
                filename: updatedFile.filename,
                uploadUrl: updatedFile.uploadPath,
                isComplete: updatedFile.isComplete,
                chunksUploaded: updatedFile.chunks,
                totalChunks: updatedFile.totalChunks
            }
        };
    }

    @Get('files/group/:groupId')
    @ApiOperation({
        summary: 'Get files by group',
        description: 'Retrieve all files belonging to a specific file group'
    })
    @ApiParam({
        name: 'groupId',
        description: 'File group ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Files retrieved successfully',
        type: EntityFilesResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'File group not found',
        type: ErrorResponseDto
    })
    async getFilesByGroup(
        @Param('groupId') groupId: string,
        @Request() req: AuthenticatedRequest
    ) {
        const files = await this.chunkedFileService.getFilesByFileGroup(groupId);

        return {
            success: true,
            data: files.map(file => ({
                id: file.id,
                filename: file.filename,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                uploadPath: file.uploadPath,
                isComplete: file.isComplete,
                chunks: file.chunks,
                totalChunks: file.totalChunks,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt
            }))
        };
    }

    private getMimeType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();

        return EXTENSION_MIME_MAP[extension || ''] || 'application/octet-stream';
    }
}
