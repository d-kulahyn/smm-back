export interface FileStorageService {
  createFile(params: {
    fileId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    entityType: string;
    entityId: string;
    uploadedBy: string;
    totalChunks?: number;
  }): Promise<void>;

  uploadChunk(fileId: string, chunkData: Buffer, chunkIndex: number): Promise<void>;

  assembleChunks(fileId: string, totalChunks: number, finalFilename: string): Promise<void>;

  deleteFile(fileId: string, filename?: string): Promise<void>;

  getFileUrl(filename: string): string;

  cleanup(fileId: string): Promise<void>;
}
