import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly avatarsPath = join(this.uploadPath, 'avatars');
  private readonly messagesPath = join(this.uploadPath, 'messages');

  constructor() {
    this.ensureDirectoriesExist();
  }

  private async ensureDirectoriesExist(): Promise<void> {
    const paths = [this.uploadPath, this.avatarsPath, this.messagesPath];

    for (const path of paths) {
      try {
        await fs.access(path);
      } catch {
        await fs.mkdir(path, { recursive: true });
      }
    }
  }

  async saveAvatar(file: Express.Multer.File): Promise<string> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Only image files are allowed for avatars');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Avatar file size must be less than 5MB');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
    const filePath = join(this.uploadPath, 'avatars', fileName);

    await fs.writeFile(filePath, file.buffer);

    return fileName;
  }

  async deleteAvatar(avatarPath: string): Promise<void> {
    if (!avatarPath) return;

    try {
      const fullPath = join(this.uploadPath, avatarPath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(`Failed to delete avatar file: ${avatarPath}`, error);
    }
  }

  async saveMessageFile(file: Express.Multer.File): Promise<{ filePath: string; originalName: string }> {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip', 'application/x-rar-compressed',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('File type not allowed');
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size must be less than 50MB');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
    const filePath = join(this.messagesPath, fileName);

    await fs.writeFile(filePath, file.buffer);

    return {
      filePath: fileName,
      originalName: file.originalname
    };
  }

  async deleteMessageFile(filePath: string): Promise<void> {
    if (!filePath) return;

    try {
      const fullPath = join(this.messagesPath, filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(`Failed to delete message file: ${filePath}`, error);
    }
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
  }

  getAvatarUrl(avatarPath: string): string {
    return `/storage/${avatarPath}`;
  }
}
