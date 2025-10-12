import { FileGroup } from '../entities/file-group.entity';

export interface FileGroupRepository {
  findById(id: string): Promise<FileGroup | null>;
  findByEntity(entityType: string, entityId: string): Promise<FileGroup[]>;
  findByCreatedBy(createdBy: string): Promise<FileGroup[]>;
  create(fileGroup: FileGroup): Promise<FileGroup>;
  update(id: string, updates: Partial<FileGroup>): Promise<FileGroup>;
  delete(id: string): Promise<void>;
  findByName(name: string, entityType: string, entityId: string): Promise<FileGroup | null>;
}
