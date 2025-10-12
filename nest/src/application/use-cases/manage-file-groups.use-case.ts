import { Injectable, Inject } from '@nestjs/common';
import { FileRepository } from '../../domain/repositories/file.repository';
import { FileGroupRepository } from '../../domain/repositories/file-group.repository';
import { FileEntity } from '../../domain/entities/file.entity';

export interface AssignFileToGroupDto {
  fileId: string;
  fileGroupId: string;
  userId: string;
}

export interface RemoveFileFromGroupDto {
  fileId: string;
  userId: string;
}

@Injectable()
export class AssignFileToGroupUseCase {
  constructor(
    @Inject('FILE_REPOSITORY')
    private readonly fileRepository: FileRepository,
    @Inject('FILE_GROUP_REPOSITORY')
    private readonly fileGroupRepository: FileGroupRepository,
  ) {}

  async execute(dto: AssignFileToGroupDto): Promise<FileEntity> {
    // Проверяем существование файла
    const file = await this.fileRepository.findById(dto.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Проверяем права доступа к файлу
    if (file.uploadedBy !== dto.userId) {
      throw new Error('You do not have permission to modify this file');
    }

    // Проверяем существование группы
    const fileGroup = await this.fileGroupRepository.findById(dto.fileGroupId);
    if (!fileGroup) {
      throw new Error('File group not found');
    }

    // Проверяем, что файл и группа принадлежат одной сущности
    if (file.entityType !== fileGroup.entityType || file.entityId !== fileGroup.entityId) {
      throw new Error('File and file group must belong to the same entity');
    }

    // Проверяем права доступа к группе
    if (!fileGroup.canBeEditedBy(dto.userId)) {
      throw new Error('You do not have permission to modify this file group');
    }

    return await this.fileRepository.assignToGroup(dto.fileId, dto.fileGroupId);
  }
}

@Injectable()
export class RemoveFileFromGroupUseCase {
  constructor(
    @Inject('FILE_REPOSITORY')
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(dto: RemoveFileFromGroupDto): Promise<FileEntity> {
    // Проверяем существование файла
    const file = await this.fileRepository.findById(dto.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Проверяем права доступа к файлу
    if (file.uploadedBy !== dto.userId) {
      throw new Error('You do not have permission to modify this file');
    }

    // Проверяем, что файл действительно принадлежит группе
    if (!file.belongsToGroup()) {
      throw new Error('File does not belong to any group');
    }

    return await this.fileRepository.removeFromGroup(dto.fileId);
  }
}
