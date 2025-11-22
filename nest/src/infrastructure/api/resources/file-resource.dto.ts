import { FileEntity } from '../../../domain/entities/file.entity';
import { FileGroup } from '../../../domain/entities/file-group.entity';
import { FileGroupResource } from './file-group-resource.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResource {
  @ApiProperty({ example: 'clm1file123456', description: 'File ID' })
  id: string;

  @ApiProperty({ example: 'document.pdf', description: 'File name' })
  filename: string;

  @ApiProperty({ example: 'original-document.pdf', description: 'Original file name' })
  originalName: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ example: 1024000, description: 'File size in bytes' })
  size: number;

  @ApiProperty({ example: 'projects/123/document.pdf', description: 'Upload path' })
  uploadPath: string;

  @ApiProperty({ example: '/storage/chunked/projects/123/document.pdf', description: 'File download URL' })
  uploadUrl: string;

  @ApiProperty({ example: '/storage/chunked/projects/123/document.pdf', description: 'File view URL (for viewing in browser)' })
  viewUrl: string;

  @ApiProperty({ example: 'project', description: 'Entity type' })
  entityType: string;

  @ApiProperty({ example: 'clm1project123', description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ example: 'clm1user123', description: 'User ID who uploaded' })
  uploadedBy: string;

  @ApiPropertyOptional({ example: 'device-uuid-123', description: 'Device ID from which file was uploaded' })
  deviceId?: string;

  @ApiPropertyOptional({ example: 'clm1thumb123', description: 'Thumbnail file ID (for images)' })
  thumbnailId?: string;

  @ApiPropertyOptional({
    type: () => FileResource,
    description: 'Thumbnail file information (for images)',
    example: {
      id: 'clm1thumb123',
      filename: 'thumb_image.jpg',
      originalName: 'thumb_original.jpg',
      mimeType: 'image/jpeg',
      size: 15000,
      uploadPath: 'projects/123/thumb_image.jpg',
      entityType: 'project',
      entityId: 'clm1project123',
      uploadedBy: 'clm1user123',
      isComplete: true,
      chunks: 1,
      totalChunks: 1,
      createdAt: '2025-10-12T10:00:00.000Z',
      updatedAt: '2025-10-12T10:00:00.000Z'
    }
  })
  thumbnail?: FileResource;

  @ApiProperty({ example: true, description: 'Upload completion status' })
  isComplete: boolean;

  @ApiProperty({ example: 10, description: 'Number of uploaded chunks' })
  chunks: number;

  @ApiPropertyOptional({ example: 10, description: 'Total number of chunks' })
  totalChunks?: number;

  @ApiProperty({ example: '2025-10-12T10:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-12T10:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => FileGroupResource,
    description: 'File group information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Project Documents',
      description: 'All project-related documents',
      entityType: 'project',
      entityId: '456e7890-e89b-12d3-a456-426614174000'
    }
  })
  fileGroup?: FileGroupResource;

  constructor(file: FileEntity, fileGroup?: FileGroup, thumbnail?: FileEntity) {
    this.id = file.id;
    this.filename = file.filename;
    this.originalName = file.originalName;
    this.mimeType = file.mimeType;
    this.size = file.size;
    this.uploadPath = file.uploadPath;
    // Генерируем URL для скачивания файла с доменом и префиксом /v1
    const appUrl = process.env.APP_URL || 'http://localhost';
    const baseUrl = appUrl.replace(/\/$/, ''); // Убираем trailing slash если есть
    this.uploadUrl = `${baseUrl}/v1/storage/chunked/${encodeURI(file.uploadPath || file.filename)}`;
    this.viewUrl = `${baseUrl}/v1/storage/chunked/${encodeURI(file.uploadPath || file.filename)}`;
    this.entityType = file.entityType;
    this.entityId = file.entityId;
    this.uploadedBy = file.uploadedBy;
    this.deviceId = file.deviceId;
    this.thumbnailId = file.thumbnailId;
    this.isComplete = file.isComplete;
    this.chunks = file.chunks;
    this.totalChunks = file.totalChunks;
    this.createdAt = file.createdAt;
    this.updatedAt = file.updatedAt;

    if (fileGroup) {
      this.fileGroup = FileGroupResource.fromEntity(fileGroup);
    }

    if (thumbnail) {
      // Создаем упрощенный объект thumbnail без рекурсии
      this.thumbnail = new FileResource(thumbnail);
    }
  }

  static fromEntity(file: FileEntity, fileGroup?: FileGroup, thumbnail?: FileEntity): FileResource {
    return new FileResource(file, fileGroup, thumbnail);
  }

  static collection(files: FileEntity[], fileGroups?: Map<string, FileGroup>, thumbnails?: Map<string, FileEntity>): FileResource[] {
    return files.map(file => {
      const fileGroup = file.fileGroupId && fileGroups ? fileGroups.get(file.fileGroupId) : undefined;
      const thumbnail = file.thumbnailId && thumbnails ? thumbnails.get(file.thumbnailId) : undefined;
      return FileResource.fromEntity(file, fileGroup, thumbnail);
    });
  }
}
