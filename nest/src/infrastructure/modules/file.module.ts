import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageController } from '../api/controllers/storage.controller';
import { ChunkedFileService } from '../../application/services/chunked-file.service';
import { InMemoryFileRepository } from '../repositories/in-memory-file.repository';
import { LocalFileStorageService } from '../services/local-file-storage.service';

@Module({
  controllers: [StorageController],
  providers: [
    ChunkedFileService,
    {
      provide: 'FILE_REPOSITORY',
      useClass: InMemoryFileRepository,
    },
    {
      provide: 'FILE_STORAGE_SERVICE',
      useClass: LocalFileStorageService,
    },
    LocalFileStorageService,
  ],
  exports: [ChunkedFileService, 'FILE_REPOSITORY', 'FILE_STORAGE_SERVICE'],
})
export class FileModule {}
