import { FileGroup } from '../../../domain/entities/file-group.entity';
import { FileGroupResponseDto } from '../responses/file-group-response.dto';

export class FileGroupResource {
  static fromEntity(fileGroup: FileGroup): FileGroupResponseDto {
    return {
      id: fileGroup.id,
      name: fileGroup.name,
      description: fileGroup.description,
      entityType: fileGroup.entityType,
      entityId: fileGroup.entityId,
      createdBy: fileGroup.createdBy,
      createdAt: fileGroup.createdAt,
      updatedAt: fileGroup.updatedAt,
    };
  }

  static collection(fileGroups: FileGroup[]): FileGroupResponseDto[] {
    return fileGroups.map(this.fromEntity);
  }
}
