import { Injectable } from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';

@Injectable()
export class InMemoryFileRepository implements FileRepository {
  private files: Map<string, FileEntity> = new Map();
  // Отслеживаем загруженные чанки для каждого файла
  private uploadedChunks: Map<string, Set<number>> = new Map();

  async create(file: FileEntity): Promise<FileEntity> {
    this.files.set(file.id, file);
    // Инициализируем пустой набор чанков для файла
    this.uploadedChunks.set(file.id, new Set());
    return file;
  }

  async findById(id: string): Promise<FileEntity | null> {
      console.log(this.files);
    return this.files.get(id) || null;
  }

  async findByEntityId(entityType: string, entityId: string): Promise<FileEntity[]> {
    return Array.from(this.files.values()).filter(
      file => file.entityType === entityType && file.entityId === entityId
    );
  }

  async update(id: string, updates: Partial<FileEntity>): Promise<FileEntity> {
    const file = this.files.get(id);
    if (!file) {
      throw new Error('File not found');
    }

    const updatedFile = new FileEntity(
      file.id,
      updates.filename ?? file.filename,
      file.originalName,
      file.mimeType,
      updates.size ?? file.size,
      file.uploadPath,
      file.entityType,
      file.entityId,
      file.uploadedBy,
      updates.isComplete ?? file.isComplete,
      updates.chunks ?? file.chunks,
      file.totalChunks,
      file.createdAt,
      new Date()
    );

    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async delete(id: string): Promise<void> {
    this.files.delete(id);
    this.uploadedChunks.delete(id);
  }

  async markChunkUploaded(id: string, chunkIndex?: number): Promise<FileEntity> {
    const file = this.files.get(id);
    if (!file) {
      throw new Error('File not found');
    }

    const fileChunks = this.uploadedChunks.get(id) || new Set();

    // Если индекс указан, добавляем его в набор
    if (chunkIndex !== undefined) {
      fileChunks.add(chunkIndex);
    }

    this.uploadedChunks.set(id, fileChunks);

    // Обновляем количество загруженных чанков
    const chunksCount = fileChunks.size;

    // Проверяем, завершена ли загрузка
    const isComplete = file.totalChunks ? chunksCount >= file.totalChunks : false;

    const updatedFile = new FileEntity(
      file.id,
      file.filename,
      file.originalName,
      file.mimeType,
      file.size,
      file.uploadPath,
      file.entityType,
      file.entityId,
      file.uploadedBy,
      isComplete,
      chunksCount,
      file.totalChunks,
      file.createdAt,
      new Date()
    );

    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async markComplete(id: string): Promise<FileEntity> {
    const file = this.files.get(id);
    if (!file) {
      throw new Error('File not found');
    }

    const updatedFile = new FileEntity(
      file.id,
      file.filename,
      file.originalName,
      file.mimeType,
      file.size,
      file.uploadPath,
      file.entityType,
      file.entityId,
      file.uploadedBy,
      true, // isComplete
      file.chunks,
      file.totalChunks,
      file.createdAt,
      new Date()
    );

    this.files.set(id, updatedFile);
    return updatedFile;
  }

  // Дополнительные методы для работы с чанками
  async getUploadedChunks(id: string): Promise<number[]> {
    const chunks = this.uploadedChunks.get(id);
    return chunks ? Array.from(chunks).sort((a, b) => a - b) : [];
  }

  async getMissingChunks(id: string): Promise<number[]> {
    const file = this.files.get(id);
    if (!file || !file.totalChunks) {
      return [];
    }

    const uploadedChunks = this.uploadedChunks.get(id) || new Set();
    const missing: number[] = [];

    for (let i = 0; i < file.totalChunks; i++) {
      if (!uploadedChunks.has(i)) {
        missing.push(i);
      }
    }

    return missing;
  }

  async isChunkUploaded(id: string, chunkIndex: number): Promise<boolean> {
    const chunks = this.uploadedChunks.get(id);
    return chunks ? chunks.has(chunkIndex) : false;
  }
}
