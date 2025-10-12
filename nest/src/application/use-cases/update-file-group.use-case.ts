import { Injectable, Inject } from '@nestjs/common';
import { FileGroupRepository } from '../../domain/repositories/file-group.repository';
import { FileGroup } from '../../domain/entities/file-group.entity';

export interface UpdateFileGroupDto {
  id: string;
  name?: string;
  description?: string;
  updatedBy: string;
}

@Injectable()
export class UpdateFileGroupUseCase {
  constructor(
    @Inject('FILE_GROUP_REPOSITORY')
    private readonly fileGroupRepository: FileGroupRepository,
  ) {}

  async execute(dto: UpdateFileGroupDto): Promise<FileGroup> {
    const fileGroup = await this.fileGroupRepository.findById(dto.id);

    if (!fileGroup) {
      throw new Error('File group not found');
    }

    if (!fileGroup.canBeEditedBy(dto.updatedBy)) {
      throw new Error('You do not have permission to edit this file group');
    }

    let updatedGroup = fileGroup;

    if (dto.name && dto.name !== fileGroup.name) {
      // Проверяем уникальность нового имени
      const existingGroup = await this.fileGroupRepository.findByName(
        dto.name,
        fileGroup.entityType,
        fileGroup.entityId
      );

      if (existingGroup && existingGroup.id !== dto.id) {
        throw new Error(`File group with name "${dto.name}" already exists for this entity`);
      }

      updatedGroup = updatedGroup.updateName(dto.name);
    }

    if (dto.description !== undefined && dto.description !== fileGroup.description) {
      updatedGroup = updatedGroup.updateDescription(dto.description);
    }

    return await this.fileGroupRepository.update(dto.id, updatedGroup);
  }
}

@Injectable()
export class DeleteFileGroupUseCase {
  constructor(
    @Inject('FILE_GROUP_REPOSITORY')
    private readonly fileGroupRepository: FileGroupRepository,
  ) {}

  async execute(id: string, deletedBy: string): Promise<void> {
    const fileGroup = await this.fileGroupRepository.findById(id);

    if (!fileGroup) {
      throw new Error('File group not found');
    }

    if (!fileGroup.canBeEditedBy(deletedBy)) {
      throw new Error('You do not have permission to delete this file group');
    }

    await this.fileGroupRepository.delete(id);
  }
}
