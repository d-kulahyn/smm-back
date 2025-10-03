import { Module } from '@nestjs/common';
import { TaskController } from '../api/controllers/task.controller';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { CompleteTaskUseCase } from '../../application/use-cases/complete-task.use-case';
import { PrismaTaskRepository } from '../repositories/prisma-task.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { FileService } from '../../shared';
import { TaskPolicy } from '../../shared/policies/task.policy';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  controllers: [TaskController],
  providers: [
    // Use Cases
    CreateTaskUseCase,
    CompleteTaskUseCase,

    // Services
    PrismaService,
    FileService,
    TaskPolicy,

    // Repositories
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class TaskModule {}
