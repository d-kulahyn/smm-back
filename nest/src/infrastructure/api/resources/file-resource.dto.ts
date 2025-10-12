import { FileEntity } from '../../../domain/entities/file.entity';
import { FileGroup } from '../../../domain/entities/file-group.entity';
import { FileGroupResource } from './file-group-resource.dto';

export class FileResource {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadPath: string;
  entityType: string;
  entityId: string;
  uploadedBy: string;
  isComplete: boolean;
  chunks: number;
  totalChunks?: number;
  createdAt: Date;
  updatedAt: Date;
  fileGroup?: any;

  constructor(file: FileEntity, fileGroup?: FileGroup) {
    this.id = file.id;
    this.filename = file.filename;
    this.originalName = file.originalName;
    this.mimeType = file.mimeType;
    this.size = file.size;
    this.uploadPath = file.uploadPath;
    this.entityType = file.entityType;
    this.entityId = file.entityId;
    this.uploadedBy = file.uploadedBy;
    this.isComplete = file.isComplete;
    this.chunks = file.chunks;
    this.totalChunks = file.totalChunks;
    this.createdAt = file.createdAt;
    this.updatedAt = file.updatedAt;

    if (fileGroup) {
      this.fileGroup = FileGroupResource.fromEntity(fileGroup);
    }
  }

  static fromEntity(file: FileEntity, fileGroup?: FileGroup): FileResource {
    return new FileResource(file, fileGroup);
  }

  static collection(files: FileEntity[], fileGroups?: Map<string, FileGroup>): FileResource[] {
    return files.map(file => {
      const fileGroup = file.fileGroupId && fileGroups ? fileGroups.get(file.fileGroupId) : undefined;
      return FileResource.fromEntity(file, fileGroup);
    });
  }
}
