import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from '../api/controllers/project.controller';
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { CompleteProjectUseCase } from '../../application/use-cases/complete-project.use-case';
import { GetProjectStatsUseCase } from '../../application/use-cases/get-project-stats.use-case';
import { PrismaProjectRepository } from '../repositories/prisma-project.repository';
import { PrismaTaskRepository } from '../repositories/prisma-task.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { ChatModule } from './chat.module'; // Импортируем ChatModule
import { FileService } from '../../shared';
import { ProjectPolicy } from '../../shared';

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';
export const TASK_REPOSITORY = 'TASK_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    ChatModule, // Импортируем ChatModule чтобы получить доступ к CHAT_REPOSITORY
  ],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    CompleteProjectUseCase,
    GetProjectStatsUseCase,
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
