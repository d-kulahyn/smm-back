import { FileEntity } from '../entities/file.entity';

export interface FileRepository {
  create(file: FileEntity): Promise<FileEntity>;
  findById(id: string): Promise<FileEntity | null>;
  findByEntityId(entityType: string, entityId: string): Promise<FileEntity[]>;
  findByFileGroupId(fileGroupId: string): Promise<FileEntity[]>;
  findByEntityIdWithGroups(entityType: string, entityId: string): Promise<FileEntity[]>;
  update(id: string, updates: Partial<FileEntity>): Promise<FileEntity>;
  delete(id: string): Promise<void>;
  markChunkUploaded(id: string, chunkIndex?: number): Promise<FileEntity>;
  markComplete(id: string): Promise<FileEntity>;
  assignToGroup(fileId: string, fileGroupId: string): Promise<FileEntity>;
  removeFromGroup(fileId: string): Promise<FileEntity>;

  getUploadedChunks(id: string): Promise<number[]>;
  getMissingChunks(id: string): Promise<number[]>;
  isChunkUploaded(id: string, chunkIndex: number): Promise<boolean>;
}
