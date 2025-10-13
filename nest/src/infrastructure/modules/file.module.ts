import { Module } from '@nestjs/common';
import { StorageController } from '../api/controllers/storage.controller';
import { ChunkedFileService } from '../../application/services/chunked-file.service';
import { LocalFileStorageService } from '../services/local-file-storage.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaFileRepository } from '../repositories/prisma-file.repository';
import { RedisService } from '../services/redis.service';

@Module({
  controllers: [StorageController],
  providers: [
    ChunkedFileService,
    PrismaService,
    RedisService,
    {
      provide: 'FILE_REPOSITORY',
      useClass: PrismaFileRepository,
    },
    {
      provide: 'FILE_STORAGE_SERVICE',
      useClass: LocalFileStorageService,
    },
    LocalFileStorageService,
    PrismaFileRepository,
  ],
  exports: [ChunkedFileService, 'FILE_REPOSITORY', 'FILE_STORAGE_SERVICE'],
})
export class FileModule {}
