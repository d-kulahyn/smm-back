import {Inject, Injectable} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {FileEntity} from '../../domain/entities/file.entity';
import {FileRepository} from '../../domain/repositories/file.repository';
import {FileStorageService} from '../../domain/services/file-storage.service';

@Injectable()
export class ChunkedFileService {
    constructor(
        @Inject('FILE_REPOSITORY')
        private readonly fileRepository: FileRepository,
        @Inject('FILE_STORAGE_SERVICE')
        private readonly fileStorageService: FileStorageService,
    ) {}

    async createFile(params: {
        originalName: string;
        mimeType: string;
        size: number;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        fileGroupId?: string;
        totalChunks?: number;
    }): Promise<FileEntity> {
        const fileId = uuidv4();
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

        const fileEntity = FileEntity.create({
            id: fileId,
            filename,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size,
            uploadPath: filename,
            entityType: params.entityType,
            entityId: params.entityId,
            uploadedBy: params.uploadedBy,
            fileGroupId: params.fileGroupId,
            totalChunks: params.totalChunks,
        });

        return await this.fileRepository.create(fileEntity);
    }

    async uploadChunk(fileId: string, chunkData: Buffer, chunkIndex?: number): Promise<FileEntity> {
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

    private async assembleFile(fileId: string): Promise<FileEntity> {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }

        if (!fileEntity.totalChunks) {
            throw new Error('Cannot assemble file without totalChunks specified');
        }

        try {
            await this.fileStorageService.assembleChunks(
                fileId,
                fileEntity.totalChunks,
                fileEntity.filename
            );

            return await this.fileRepository.markComplete(fileId);

        } catch (error) {
            await this.fileStorageService.cleanup(fileId);
            throw error;
        }
    }

    async completeUpload(fileId: string): Promise<FileEntity> {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }

        // Если файл уже завершен, возвращаем его
        if (fileEntity.isComplete) {
            return fileEntity;
        }

        // Если указано общее количество чанков, проверяем их наличие
        if (fileEntity.totalChunks) {
            if (fileEntity.chunks < fileEntity.totalChunks) {
                throw new Error(`Not all chunks uploaded. Expected: ${fileEntity.totalChunks}, Received: ${fileEntity.chunks}`);
            }
            // Собираем чанки если еще не собрали
            return await this.assembleFile(fileId);
        }

        throw new Error('Cannot complete upload without totalChunks specified');
    }

    async deleteFile(fileId: string): Promise<void> {
        const fileEntity = await this.fileRepository.findById(fileId);
        if (!fileEntity) {
            throw new Error('File not found');
        }

        // Удаляем файл из хранилища
        await this.fileStorageService.deleteFile(fileId, fileEntity.filename);

        // Удаляем запись из репозитория
        await this.fileRepository.delete(fileId);
    }

    async getFilesByEntity(entityType: string, entityId: string): Promise<FileEntity[]> {
        return await this.fileRepository.findByEntityId(entityType, entityId);
    }

    getFileUrl(filename: string): string {
        return this.fileStorageService.getFileUrl(filename);
    }

    async getChunkInfo(fileId: string): Promise<{
        fileId: string;
        totalChunks?: number;
        uploadedChunks: number;
        isComplete: boolean;
        missingChunks?: number[];
        uploadedChunkIndexes?: number[];
    }> {
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

    async getFilesByFileGroup(fileGroupId: string): Promise<FileEntity[]> {
        return await this.fileRepository.findByFileGroupId(fileGroupId);
    }

    async assignFileToGroup(fileId: string, fileGroupId: string): Promise<FileEntity> {
        return await this.fileRepository.assignToGroup(fileId, fileGroupId);
    }

    async removeFileFromGroup(fileId: string): Promise<FileEntity> {
        return await this.fileRepository.removeFromGroup(fileId);
    }
}
