import { FileEntity } from '../../domain/entities/file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';
export declare class InMemoryFileRepository implements FileRepository {
    private files;
    private uploadedChunks;
    create(file: FileEntity): Promise<FileEntity>;
    findById(id: string): Promise<FileEntity | null>;
    findByEntityId(entityType: string, entityId: string): Promise<FileEntity[]>;
    update(id: string, updates: Partial<FileEntity>): Promise<FileEntity>;
    delete(id: string): Promise<void>;
    markChunkUploaded(id: string, chunkIndex?: number): Promise<FileEntity>;
    markComplete(id: string): Promise<FileEntity>;
    getUploadedChunks(id: string): Promise<number[]>;
    getMissingChunks(id: string): Promise<number[]>;
    isChunkUploaded(id: string, chunkIndex: number): Promise<boolean>;
}
