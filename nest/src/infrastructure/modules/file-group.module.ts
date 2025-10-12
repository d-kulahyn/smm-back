import { Module } from '@nestjs/common';
import { FileGroupController } from '../api/controllers/file-group.controller';
import { CreateFileGroupUseCase } from '../../application/use-cases/create-file-group.use-case';
import { UpdateFileGroupUseCase, DeleteFileGroupUseCase } from '../../application/use-cases/update-file-group.use-case';
import { PrismaFileGroupRepository } from '../repositories/prisma-file-group.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [FileGroupController],
  providers: [
    // Use Cases
    CreateFileGroupUseCase,
    UpdateFileGroupUseCase,
    DeleteFileGroupUseCase,

    // Repository
    {
      provide: 'FILE_GROUP_REPOSITORY',
      useClass: PrismaFileGroupRepository,
    },

    // Database
    PrismaService,
  ],
  exports: [
    'FILE_GROUP_REPOSITORY',
    CreateFileGroupUseCase,
    UpdateFileGroupUseCase,
    DeleteFileGroupUseCase,
  ],
})
export class FileGroupModule {}
