import {
    Controller,
    Get,
    Post,
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
import {join} from 'path';
import {existsSync} from 'fs';
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiProperty, ApiBearerAuth, ApiConsumes} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {IsString, IsNumber, IsOptional, IsUUID} from 'class-validator';
import {JwtAuthGuard} from '../../../shared/guards/jwt-auth.guard';
import {AuthenticatedRequest} from '../../../shared';
import {ChunkedFileService} from '../../../application/services/chunked-file.service';

// DTOs для чанковой загрузки
export class CreateFileDto {
    @ApiProperty({description: 'Original filename', example: 'document.pdf'})
    @IsString()
    originalName: string;

    @ApiProperty({description: 'MIME type', example: 'application/pdf'})
    @IsString()
    mimeType: string;

    @ApiProperty({description: 'File size in bytes', example: 1024000})
    @IsNumber()
    size: number;

    @ApiProperty({description: 'Entity type to attach file to', example: 'project'})
    @IsString()
    entityType: string;

    @ApiProperty({description: 'Entity ID to attach file to', example: 'clm1project123456'})
    @IsUUID()
    entityId: string;

    @ApiProperty({description: 'Total number of chunks (required for parallel uploads)', example: 10})
    @IsNumber()
    totalChunks: number;
}

export class ChunkUploadDto {
    @ApiProperty({description: 'Chunk index (0-based)', example: 0})
    @IsNumber()
    chunkIndex: number;
}

// Response DTOs
export class FileCreateResponseDto {
    @ApiProperty({example: 'clm1file123456'})
    fileId: string;

    @ApiProperty({example: 'document.pdf'})
    filename: string;

    @ApiProperty({example: '/storage/chunked/1696420398754-abc123-document.pdf'})
    uploadUrl: string;

    @ApiProperty({example: false})
    isComplete: boolean;

    @ApiProperty({example: 0})
    chunksUploaded: number;

    @ApiProperty({example: 10})
    totalChunks?: number;
}

export class ChunkUploadResponseDto {
    @ApiProperty({example: 'clm1file123456'})
    fileId: string;

    @ApiProperty({example: 5})
    chunksUploaded: number;

    @ApiProperty({example: false})
    isComplete: boolean;

    @ApiProperty({example: 'Chunk uploaded successfully'})
    message: string;

    @ApiProperty({example: 0})
    chunkIndex: number;
}

export class ChunkInfoResponseDto {
    @ApiProperty({example: 'clm1file123456'})
    fileId: string;

    @ApiProperty({example: 10})
    totalChunks?: number;

    @ApiProperty({example: 7})
    uploadedChunks: number;

    @ApiProperty({example: false})
    isComplete: boolean;

    @ApiProperty({example: [7, 8, 9], type: [Number]})
    missingChunks?: number[];
}

export class FileCompleteResponseDto {
    @ApiProperty({example: 'clm1file123456'})
    fileId: string;

    @ApiProperty({example: true})
    isComplete: boolean;

    @ApiProperty({example: '/storage/chunked/1696420398754-abc123-document.pdf'})
    downloadUrl: string;

    @ApiProperty({example: 'File upload completed successfully'})
    message: string;
}

export class EntityFilesResponseDto {
    @ApiProperty({type: [FileCreateResponseDto]})
    files: FileCreateResponseDto[];

    @ApiProperty({example: 3})
    total: number;
}

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
    private readonly uploadPath = join(process.cwd(), 'uploads');

    constructor(
        private readonly chunkedFileService: ChunkedFileService
    ) {
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
            });

            return {
                fileId: fileEntity.id,
                filename: fileEntity.filename,
                uploadUrl: `/storage/chunked/${fileEntity.id}`,
                isComplete: fileEntity.isComplete,
                chunksUploaded: fileEntity.chunks,
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create file');
        }
    }

    @Post('chunked/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
                message: 'Chunk uploaded successfully',
                chunkIndex: 0, // Указываем индекс чанка
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to upload chunk');
        }
    }

    @Post('upload/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
            // Используем raw request для получения любого поля файла
            const multer = require('multer');
            const upload = multer({
                limits: {
                    fileSize: 50 * 1024 * 1024, // 50MB chunk limit
                },
                fileFilter: (req, file, callback) => {
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
                        const file = req.files[0]; // Берем первый файл
                        const updatedFile = await this.chunkedFileService.uploadChunk(
                            fileId,
                            file.buffer
                        );

                        const response = {
                            fileId: updatedFile.id,
                            chunksUploaded: updatedFile.chunks,
                            isComplete: updatedFile.isComplete,
                            message: 'Chunk uploaded successfully',
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
                downloadUrl: `/storage/chunked/${completedFile.filename}`,
                message: 'File upload completed successfully',
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to complete upload');
        }
    }

    @Get('chunked/:filename')
    @ApiOperation({
        summary: 'Get chunked file',
        description: 'Serve chunked uploaded files'
    })
    @ApiParam({
        name: 'filename',
        description: 'Chunked file name',
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
    async getChunkedFile(@Param('filename') filename: string, @Res() res: Response) {
        try {
            const filePath = join(this.uploadPath, 'chunked', filename);

            if (!existsSync(filePath)) {
                throw new NotFoundException('File not found');
            }

            const mimeType = this.getMimeType(filename);

            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=86400');

            if (!mimeType.startsWith('image/') && !mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
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
                uploadUrl: `/storage/chunked/${file.filename}`,
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
                message: 'Chunk uploaded successfully',
                chunkIndex: chunkIndex,
            };
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to upload chunk');
        }
    }

    @Get('info/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
            return chunkInfo;
        } catch (error) {
            if (error.message === 'File not found') {
                throw new NotFoundException('File not found');
            }
            throw new BadRequestException(error.message || 'Failed to get chunk info');
        }
    }

    private getMimeType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();

        const mimeTypes: { [key: string]: string } = {
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
}
