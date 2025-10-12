import { Injectable, Inject } from '@nestjs/common';
import { FileGroupRepository } from '../../domain/repositories/file-group.repository';
import { FileGroup } from '../../domain/entities/file-group.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateFileGroupDto {
  name: string;
  description: string;
  entityType: string;
  entityId: string;
  createdBy: string;
}

@Injectable()
export class CreateFileGroupUseCase {
  constructor(
    @Inject('FILE_GROUP_REPOSITORY')
    private readonly fileGroupRepository: FileGroupRepository,
  ) {}

  async execute(dto: CreateFileGroupDto): Promise<FileGroup> {
    // Проверяем, что группа с таким именем не существует для данной сущности
    const existingGroup = await this.fileGroupRepository.findByName(
      dto.name,
      dto.entityType,
      dto.entityId
    );

    if (existingGroup) {
      throw new Error(`File group with name "${dto.name}" already exists for this entity`);
    }

    const fileGroup = new FileGroup(
      uuidv4(),
      dto.name,
      dto.description,
      dto.entityType,
      dto.entityId,
      dto.createdBy,
      new Date(),
      new Date(),
    );

    return await this.fileGroupRepository.create(fileGroup);
  }
}
