import { FileEntity } from '../../domain/entities/file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';
import { FileStorageService } from '../../domain/services/file-storage.service';
export declare class ChunkedFileService {
    private readonly fileRepository;
    private readonly fileStorageService;
    constructor(fileRepository: FileRepository, fileStorageService: FileStorageService);
    createFile(params: {
        originalName: string;
        mimeType: string;
        size: number;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        totalChunks?: number;
    }): Promise<FileEntity>;
    uploadChunk(fileId: string, chunkData: Buffer, chunkIndex?: number): Promise<FileEntity>;
    private assembleFile;
    completeUpload(fileId: string): Promise<FileEntity>;
    deleteFile(fileId: string): Promise<void>;
    getFilesByEntity(entityType: string, entityId: string): Promise<FileEntity[]>;
    getFileUrl(filename: string): string;
    getChunkInfo(fileId: string): Promise<{
        fileId: string;
        totalChunks?: number;
        uploadedChunks: number;
        isComplete: boolean;
        missingChunks?: number[];
        uploadedChunkIndexes?: number[];
    }>;
}
