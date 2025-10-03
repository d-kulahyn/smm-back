import { Injectable, Inject } from '@nestjs/common';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskPriority, TaskStatus } from '../../domain/enums';

export interface CreateTaskCommand {
  title: string;
  description?: string;
  projectId: string;
  creatorId: string;
  priority?: TaskPriority;
  status?: TaskStatus; // Добавляем это поле
  attachments?: string[]; // Добавляем поле attachments
  dueDate?: Date;
  assignedTo?: string;
  notes?: string;
  reminderBeforeHours?: number; // Добавляем это поле
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const task = new Task(
      crypto.randomUUID(),
      command.title,
      command.projectId,
      command.creatorId,
      command.description,
      TaskStatus.pending, // status будет по умолчанию pending
      command.priority || TaskPriority.MEDIUM,
      command.assignedTo, // assignedTo
      command.attachments, // attachments
      undefined, // completedAt
      command.dueDate,
    );

    return this.taskRepository.create(task);
  }
}
