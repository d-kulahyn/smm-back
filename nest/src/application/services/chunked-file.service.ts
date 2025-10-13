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
        uploadPath?: string; // относительный путь внутри uploads, например 'projects/123'
    }): Promise<FileEntity> {
        //if exsists by originalName, mimeType, size, entityType, totalChunks return it


        const fileId = uuidv4();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${params.originalName}`;

        // Validate and sanitize uploadPath to avoid path traversal
        let sanitizedUploadPath: string | undefined = undefined;
        if (params.uploadPath) {
            const raw = params.uploadPath;
            // Reject suspicious paths
            if (raw.includes('..') || raw.includes('\\')) {
                throw new Error('Invalid uploadPath');
            }
            sanitizedUploadPath = raw.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
            if (sanitizedUploadPath.length === 0) sanitizedUploadPath = undefined;
        }

        // Передаём uploadPath (директория) в сервис хранения файлов
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
            uploadPath: sanitizedUploadPath,
        });

        // Формируем поле uploadPath в сущности как относительный путь включая имя файла
        const fullUploadPath = sanitizedUploadPath ? `${sanitizedUploadPath}/${filename}` : filename;

        const fileEntity = FileEntity.create({
            id: fileId,
            filename,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size,
            uploadPath: fullUploadPath,
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

        // Determine actual chunk index and reserve it to avoid parallel races
        let actualChunkIndex = chunkIndex !== undefined ? chunkIndex : fileEntity.chunks;

        // If chunkIndex provided - try to reserve once; if fails, return current state (idempotent)
        if (chunkIndex !== undefined) {
            const reserved = await this.fileRepository.tryReserveChunk(fileId, chunkIndex);
            if (!reserved) {
                // Already uploaded or reserved by another worker — return current state
                const current = await this.fileRepository.findById(fileId);
                if (!current) throw new Error('File not found');
                return current;
            }
        } else {
            // For sequential uploads, try to reserve the next available index with a few retries
            let attempts = 0;
            let reserved = false;
            while (attempts < 5 && !reserved) {
                actualChunkIndex = (await this.fileRepository.findById(fileId))!.chunks;
                reserved = await this.fileRepository.tryReserveChunk(fileId, actualChunkIndex);
                if (!reserved) {
                    // another parallel worker took it — retry
                    attempts++;
                }
            }

            if (!reserved) {
                // couldn't reserve after retries, return current state
                const current = await this.fileRepository.findById(fileId);
                if (!current) throw new Error('File not found');
                return current;
            }
        }

        // At this point reservation acquired for actualChunkIndex
        try {
            await this.fileStorageService.uploadChunk(fileId, chunkData, actualChunkIndex);

            const updatedFile = await this.fileRepository.markChunkUploaded(fileId, actualChunkIndex);

            if (updatedFile.totalChunks && updatedFile.chunks >= updatedFile.totalChunks) {
                return await this.assembleFile(fileId);
            }

            return updatedFile;
        } catch (error) {
            // On error, release reservation and rethrow
            try {
                await this.fileRepository.releaseReservedChunk(fileId, actualChunkIndex);
            } catch (e) {
                // ignore
            }
            throw error;
        }
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
            // Передаём полный относительный путь (uploadPath включая имя файла) в сервис сборки
            await this.fileStorageService.assembleChunks(
                fileId,
                fileEntity.totalChunks,
                fileEntity.uploadPath // теперь это относительный путь + имя файла
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

        // Удаляем файл из хранилища — передаём полный относительный путь (uploadPath), если есть
        await this.fileStorageService.deleteFile(fileId, fileEntity.uploadPath || fileEntity.filename);

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
