import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FileGroupRepository } from '../../domain/repositories/file-group.repository';
import { FileGroup } from '../../domain/entities/file-group.entity';

@Injectable()
export class PrismaFileGroupRepository implements FileGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FileGroup | null> {
    const fileGroup = await this.prisma.fileGroup.findUnique({
      where: { id }
    });

    return fileGroup ? this.toDomain(fileGroup) : null;
  }

  async findByEntity(entityType: string, entityId: string): Promise<FileGroup[]> {
    const fileGroups = await this.prisma.fileGroup.findMany({
      where: {
        entityType,
        entityId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return fileGroups.map(this.toDomain);
  }

  async findByCreatedBy(createdBy: string): Promise<FileGroup[]> {
    const fileGroups = await this.prisma.fileGroup.findMany({
      where: {
        createdBy
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return fileGroups.map(this.toDomain);
  }

  async findByName(name: string, entityType: string, entityId: string): Promise<FileGroup | null> {
    const fileGroups = await this.prisma.fileGroup.findMany({
      where: {
        name,
        entityType,
        entityId
      }
    });

    return fileGroups.length > 0 ? this.toDomain(fileGroups[0]) : null;
  }

  async create(fileGroup: FileGroup): Promise<FileGroup> {
    const created = await this.prisma.fileGroup.create({
      data: this.toPrisma(fileGroup)
    });

    return this.toDomain(created);
  }

  async update(id: string, updates: Partial<FileGroup>): Promise<FileGroup> {
    const updated = await this.prisma.fileGroup.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.fileGroup.delete({
      where: { id }
    });
  }

  async findByNameAndEntity(name: string, entityType: string, entityId: string): Promise<FileGroup | null> {
    const fileGroup = await this.prisma.fileGroup.findFirst({
      where: {
        name,
        entityType,
        entityId
      }
    });

    return fileGroup ? this.toDomain(fileGroup) : null;
  }

  private toDomain(doc: any): FileGroup {
    return new FileGroup(
      doc.id,
      doc.name,
      doc.description,
      doc.entityType,
      doc.entityId,
      doc.createdBy,
      doc.createdAt,
      doc.updatedAt
    );
  }

  private toPrisma(fileGroup: FileGroup): any {
    return {
      id: fileGroup.id,
      name: fileGroup.name,
      description: fileGroup.description,
      entityType: fileGroup.entityType,
      entityId: fileGroup.entityId,
      createdBy: fileGroup.createdBy,
      createdAt: fileGroup.createdAt,
      updatedAt: fileGroup.updatedAt
    };
  }
}
