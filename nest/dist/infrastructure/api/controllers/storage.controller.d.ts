import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared';
import { ChunkedFileService } from '../../../application/services/chunked-file.service';
export declare class CreateFileDto {
    originalName: string;
    mimeType: string;
    size: number;
    entityType: string;
    entityId: string;
    totalChunks: number;
}
export declare class ChunkUploadDto {
    chunkIndex: number;
}
export declare class FileCreateResponseDto {
    fileId: string;
    filename: string;
    uploadUrl: string;
    isComplete: boolean;
    chunksUploaded: number;
    totalChunks?: number;
}
export declare class ChunkUploadResponseDto {
    fileId: string;
    chunksUploaded: number;
    isComplete: boolean;
    message: string;
    chunkIndex: number;
}
export declare class ChunkInfoResponseDto {
    fileId: string;
    totalChunks?: number;
    uploadedChunks: number;
    isComplete: boolean;
    missingChunks?: number[];
}
export declare class FileCompleteResponseDto {
    fileId: string;
    isComplete: boolean;
    downloadUrl: string;
    message: string;
}
export declare class EntityFilesResponseDto {
    files: FileCreateResponseDto[];
    total: number;
}
export declare class StorageController {
    private readonly chunkedFileService;
    private readonly uploadPath;
    constructor(chunkedFileService: ChunkedFileService);
    createFile(createFileDto: CreateFileDto, req: AuthenticatedRequest): Promise<FileCreateResponseDto>;
    uploadFileChunk(fileId: string, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ChunkUploadResponseDto>;
    uploadFileChunkFlexible(fileId: string, req: any, res: Response): Promise<unknown>;
    completeFileUpload(fileId: string, req: AuthenticatedRequest): Promise<FileCompleteResponseDto>;
    getChunkedFile(filename: string, res: Response): Promise<void>;
    getFilesByEntity(entityType: string, entityId: string): Promise<EntityFilesResponseDto>;
    uploadFileChunkWithIndex(fileId: string, chunkIndexStr: string, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ChunkUploadResponseDto>;
    getChunkInfo(fileId: string, req: AuthenticatedRequest): Promise<ChunkInfoResponseDto>;
    private getMimeType;
}
