import {Injectable} from '@nestjs/common';
import {PrismaService} from '../database/prisma.service';
import {FileRepository} from '../../domain/repositories/file.repository';
import {FileEntity} from '../../domain/entities/file.entity';
import {RedisService} from '../services/redis.service';

@Injectable()
export class PrismaFileRepository implements FileRepository {
    constructor(private readonly prisma: PrismaService, private readonly redisService: RedisService) {
    }

    private toDomain(doc: any): FileEntity {
        if (!doc) return null as any;

        return new FileEntity(
            doc.id,
            doc.filename,
            doc.originalName,
            doc.mimeType,
            doc.size,
            doc.uploadPath,
            doc.entityType,
            doc.entityId,
            doc.uploadedBy,
            doc.fileGroupId ?? undefined,
            doc.thumbnailId ?? undefined,
            doc.isComplete,
            doc.chunks ?? 0,
            doc.totalChunks ?? undefined,
            doc.deviceId ?? undefined,
            doc.createdAt,
            doc.updatedAt,
        );
    }

    async create(file: FileEntity): Promise<FileEntity> {
        const created = await this.prisma.file.create({
            data: {
                id: file.id,
                filename: file.filename,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: Math.floor(file.size),
                uploadPath: file.uploadPath,
                entityType: file.entityType,
                entityId: file.entityId,
                uploadedBy: file.uploadedBy,
                fileGroupId: file.fileGroupId ?? null,
                thumbnailId: file.thumbnailId ?? null,
                isComplete: file.isComplete ?? false,
                chunks: file.chunks ?? 0,
                totalChunks: file.totalChunks ?? undefined,
                deviceId: file.deviceId ?? null,
            }
        });

        return this.toDomain(created);
    }

    async findById(id: string): Promise<FileEntity | null> {
        const doc = await this.prisma.file.findUnique({where: {id}});
        return doc ? this.toDomain(doc) : null;
    }

    async findByIds(ids: string[]): Promise<FileEntity[]> {
        if (!ids || ids.length === 0) {
            return [];
        }
        const docs = await this.prisma.file.findMany({
            where: {id: {in: ids}}
        });
        return docs.map(d => this.toDomain(d));
    }

    async findByEntityId(entityType: string, entityId: string): Promise<FileEntity[]> {
        const docs = await this.prisma.file.findMany({
            where: {entityType, entityId},
            orderBy: {createdAt: 'desc'}
        });
        return docs.map(d => this.toDomain(d));
    }

    async findByFileGroupId(fileGroupId: string): Promise<FileEntity[]> {
        const docs = await this.prisma.file.findMany({
            where: {fileGroupId},
            orderBy: {createdAt: 'desc'}
        });
        return docs.map(d => this.toDomain(d));
    }

    async findByEntityIdWithGroups(entityType: string, entityId: string): Promise<FileEntity[]> {
        return this.findByEntityId(entityType, entityId);
    }

    async update(id: string, updates: Partial<FileEntity>): Promise<FileEntity> {
        const data: any = {
            updatedAt: new Date(),
        };

        if (updates.filename !== undefined) data.filename = updates.filename;
        if (updates.originalName !== undefined) data.originalName = updates.originalName;
        if (updates.mimeType !== undefined) data.mimeType = updates.mimeType;
        if (updates.size !== undefined) data.size = Math.floor(updates.size as number);
        if (updates.uploadPath !== undefined) data.uploadPath = updates.uploadPath;
        if (updates.entityType !== undefined) data.entityType = updates.entityType;
        if (updates.entityId !== undefined) data.entityId = updates.entityId;
        if (updates.uploadedBy !== undefined) data.uploadedBy = updates.uploadedBy;
        if (updates.fileGroupId !== undefined) data.fileGroupId = updates.fileGroupId;
        if (updates.thumbnailId !== undefined) data.thumbnailId = updates.thumbnailId;
        if (updates.isComplete !== undefined) data.isComplete = updates.isComplete;
        if (updates.chunks !== undefined) data.chunks = Math.floor(updates.chunks as number);
        if (updates.totalChunks !== undefined) data.totalChunks = updates.totalChunks;

        const updated = await this.prisma.file.update({where: {id}, data});
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        const redisKey = `file:${id}:chunks`;
        try {
            await this.redisService.del(redisKey);
        } catch (err) {
            // ignore
        }

        await this.prisma.file.delete({where: {id}});
    }

    async tryReserveChunk(fileId: string, chunkIndex: number): Promise<boolean> {
        const redisKey = `file:${fileId}:chunks`;
        const added = await this.redisService.sadd(redisKey, chunkIndex);
        if (added === 1) {
            try {
                await this.redisService.expire(redisKey, 60 * 60 * 24); // 24h
            } catch (e) {
                // ignore if cannot set TTL
            }
        }
        return added === 1;

    }

    async releaseReservedChunk(fileId: string, chunkIndex: number): Promise<void> {
        const redisKey = `file:${fileId}:chunks`;
        try {
            await this.redisService.srem(redisKey, chunkIndex);
        } catch (err) {
            // ignore
        }
    }

    async markChunkUploaded(id: string, chunkIndex?: number): Promise<FileEntity> {
        const file = await this.prisma.file.findUnique({where: {id}});
        if (!file) throw new Error('File not found');

        const updated = await this.prisma.file.update({
            where: {id},
            data: {
                chunks: {increment: 1},
                isComplete: file.totalChunks ? (file.chunks ?? 0) + 1 >= file.totalChunks : file.isComplete,
                updatedAt: new Date(),
            }
        });

        return this.toDomain(updated);
    }

    async markComplete(id: string): Promise<FileEntity> {
        const updated = await this.prisma.file.update({
            where: {id},
            data: {
                isComplete: true,
                updatedAt: new Date(),
            }
        });

        const redisKey = `file:${id}:chunks`;
        try {
            await this.redisService.del(redisKey);
        } catch (err) {
            // ignore
        }

        return this.toDomain(updated);
    }

    async assignToGroup(fileId: string, fileGroupId: string): Promise<FileEntity> {
        const updated = await this.prisma.file.update({
            where: {id: fileId},
            data: {fileGroupId}
        });
        return this.toDomain(updated);
    }

    async removeFromGroup(fileId: string): Promise<FileEntity> {
        const updated = await this.prisma.file.update({
            where: {id: fileId},
            data: {fileGroupId: null}
        });
        return this.toDomain(updated);
    }

    async getUploadedChunks(id: string): Promise<number[]> {
        const redisKey = `file:${id}:chunks`;

        const members = await this.redisService.smembers(redisKey);
        if (members && members.length > 0) {
            return members.map(m => parseInt(m, 10)).sort((a, b) => a - b);
        }
    }

    async getMissingChunks(id: string): Promise<number[]> {
        const file = await this.prisma.file.findUnique({where: {id}});
        if (!file || !file.totalChunks) return [];

        const redisKey = `file:${id}:chunks`;

        let uploadedSet = new Set<number>();
        const members = await this.redisService.smembers(redisKey);
        if (members && members.length > 0) {
            uploadedSet = new Set(members.map(m => parseInt(m, 10)));
        }

        const missing: number[] = [];
        for (let i = 0; i < (file.totalChunks ?? 0); i++) {
            if (!uploadedSet.has(i)) missing.push(i);
        }

        return missing;
    }

    async isChunkUploaded(id: string, chunkIndex: number): Promise<boolean> {
        const redisKey = `file:${id}:chunks`;
        try {
            const exists = await this.redisService.sismember(redisKey, chunkIndex);
            if (exists) return true;
        } catch (err) {
            // ignore
        }

        const file = await this.prisma.file.findUnique({where: {id}});
        if (!file) return false;
        return chunkIndex < (file.chunks ?? 0);
    }
}
