import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { FileStorageService } from '../../domain/services/file-storage.service';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly chunkedPath = join(this.uploadPath, 'chunked');
  private readonly tempChunksPath = join(this.uploadPath, 'temp-chunks');

  constructor() {
    this.ensureDirectoriesExist();
  }

  private async ensureDirectoriesExist(): Promise<void> {
    const paths = [this.uploadPath, this.chunkedPath, this.tempChunksPath];

    for (const path of paths) {
      try {
        await fs.access(path);
      } catch {
        await fs.mkdir(path, { recursive: true });
      }
    }
  }

  // Создаёт необходимые директории и пустой финальный файл
  async createFile(params: {
    fileId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    entityType: string;
    entityId: string;
    uploadedBy: string;
    totalChunks?: number;
    uploadPath?: string; // относительный путь внутри uploads, например 'projects/123'
    deviceId?: string;
  }): Promise<void> {
    // Если указан uploadPath, создаём соответствующую директорию в chunkedPath
    let finalPathRelative = params.filename;
    if (params.uploadPath) {
      const cleaned = params.uploadPath.replace(/^\/+|\/+$/g, '');
      finalPathRelative = `${cleaned}/${params.filename}`;
      const targetDir = join(this.chunkedPath, cleaned);
      await fs.mkdir(targetDir, { recursive: true });
    }

    const uploadPath = join(this.chunkedPath, finalPathRelative);

    // Создаём пустой финальный файл
    await fs.writeFile(uploadPath, Buffer.alloc(0));

    // Создаём директорию для временных чанков этого файла
    const tempChunkDir = join(this.tempChunksPath, params.fileId);
    await fs.mkdir(tempChunkDir, { recursive: true });
  }

  async uploadChunk(fileId: string, chunkData: Buffer, chunkIndex: number): Promise<void> {
    const tempChunkDir = join(this.tempChunksPath, fileId);
    const chunkFilePath = join(tempChunkDir, `chunk-${chunkIndex.toString().padStart(6, '0')}`);

    await fs.writeFile(chunkFilePath, chunkData);
  }

  async assembleChunks(fileId: string, totalChunks: number, finalRelativePath: string): Promise<void> {
    const tempChunkDir = join(this.tempChunksPath, fileId);
    const finalFilePath = join(this.chunkedPath, finalRelativePath);

    try {
      // Получаем все файлы чанков и сортируем их по индексу
      const chunkFiles = await fs.readdir(tempChunkDir);
      const sortedChunkFiles = chunkFiles
        .filter(file => file.startsWith('chunk-'))
        .sort((a, b) => {
          const indexA = parseInt(a.replace('chunk-', ''));
          const indexB = parseInt(b.replace('chunk-', ''));
          return indexA - indexB;
        });

      // Проверяем, что все чанки на месте
      if (sortedChunkFiles.length !== totalChunks) {
        throw new Error(`Missing chunks. Expected: ${totalChunks}, Found: ${sortedChunkFiles.length}`);
      }

      // Создаём директорию для финального файла если нужно
      const finalDir = dirname(finalFilePath);
      await fs.mkdir(finalDir, { recursive: true });

      // Создаем поток записи для финального файла
      const writeHandle = await fs.open(finalFilePath, 'w');

      // Последовательно записываем чанки в правильном порядке
      for (const chunkFile of sortedChunkFiles) {
        const chunkPath = join(tempChunkDir, chunkFile);
        const chunkData = await fs.readFile(chunkPath);
        await writeHandle.write(chunkData);
      }

      await writeHandle.close();

      // Удаляем временные чанки
      await this.cleanup(fileId);
    } catch (error) {
      // В случае ошибки очищаем временные файлы
      await this.cleanup(fileId);
      throw error;
    }
  }

  async deleteFile(fileId: string, filename?: string): Promise<void> {
    if (filename) {
      try {
        const filePath = join(this.chunkedPath, filename);
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete final file: ${filename}`, error);
      }
    }

    await this.cleanup(fileId);
  }

  async cleanup(fileId: string): Promise<void> {
    const tempChunkDir = join(this.tempChunksPath, fileId);
    try {
      await fs.rm(tempChunkDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Failed to cleanup temp chunks for file ${fileId}:`, error);
    }
  }

  getFileUrl(filename: string): string {
    // filename может быть относительным путём (projects/123/filename)
    const cleaned = filename.replace(/^\/+/, '');
    return `/storage/chunked/${cleaned}`;
  }
}
