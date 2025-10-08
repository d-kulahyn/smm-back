import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared';
import { ChunkedFileService } from '../../../application/services/chunked-file.service';
import { CreateFileDto } from '../requests';
import { FileCreateResponseDto, ChunkUploadResponseDto, ChunkInfoResponseDto, FileCompleteResponseDto, EntityFilesResponseDto } from '../responses';
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
