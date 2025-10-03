import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from '../api/controllers/project.controller';
import { StorageController } from '../api/controllers/storage.controller';
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { CompleteProjectUseCase } from '../../application/use-cases/complete-project.use-case';
import { GetProjectStatsUseCase } from '../../application/use-cases/get-project-stats.use-case';
import { PrismaProjectRepository } from '../repositories/prisma-project.repository';
import { PrismaTaskRepository } from '../repositories/prisma-task.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { ChatService } from '../services/chat.service';
import { FileService } from '../../shared';
import { ProjectPolicy } from '../../shared';
import { Chat, ChatSchema } from '../database/schemas/chat.schema';

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';
export const TASK_REPOSITORY = 'TASK_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ProjectController, StorageController],
  providers: [
    CreateProjectUseCase,
    CompleteProjectUseCase,
    GetProjectStatsUseCase,
    ChatService,
    PrismaService,
    FileService,
    ProjectPolicy,
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [FileService, ProjectPolicy],
})
export class ProjectModule {}
