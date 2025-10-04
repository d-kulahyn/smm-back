export class FileEntity {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly uploadPath: string,
    public readonly entityType: string, // 'project', 'task', 'message', etc.
    public readonly entityId: string,
    public readonly uploadedBy: string,
    public readonly isComplete: boolean = false,
    public readonly chunks: number = 0,
    public readonly totalChunks?: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(params: {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadPath: string;
    entityType: string;
    entityId: string;
    uploadedBy: string;
    totalChunks?: number;
  }): FileEntity {
    return new FileEntity(
      params.id,
      params.filename,
      params.originalName,
      params.mimeType,
      params.size,
      params.uploadPath,
      params.entityType,
      params.entityId,
      params.uploadedBy,
      false, // isComplete
      0, // chunks
      params.totalChunks,
      new Date(),
      new Date()
    );
  }

  markChunkUploaded(): FileEntity {
    return new FileEntity(
      this.id,
      this.filename,
      this.originalName,
      this.mimeType,
      this.size,
      this.uploadPath,
      this.entityType,
      this.entityId,
      this.uploadedBy,
      this.totalChunks ? (this.chunks + 1) >= this.totalChunks : false,
      this.chunks + 1,
      this.totalChunks,
      this.createdAt,
      new Date()
    );
  }

  markComplete(): FileEntity {
    return new FileEntity(
      this.id,
      this.filename,
      this.originalName,
      this.mimeType,
      this.size,
      this.uploadPath,
      this.entityType,
      this.entityId,
      this.uploadedBy,
      true,
      this.chunks,
      this.totalChunks,
      this.createdAt,
      new Date()
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      filename: this.filename,
      originalName: this.originalName,
      mimeType: this.mimeType,
      size: this.size,
      uploadPath: this.uploadPath,
      entityType: this.entityType,
      entityId: this.entityId,
      uploadedBy: this.uploadedBy,
      isComplete: this.isComplete,
      chunks: this.chunks,
      totalChunks: this.totalChunks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
