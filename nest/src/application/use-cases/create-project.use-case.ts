import { Injectable, Inject } from '@nestjs/common';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';

export interface CreateProjectCommand {
  name: string;
  description?: string;
  ownerId: string;
  // Новые поля из PHP версии
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  avatar?: string;
  color?: string;
  metadata?: any;
}

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const project = new Project(
      crypto.randomUUID(),
      command.name,
      command.ownerId,
      command.description,
      command.status || ProjectStatus.ACTIVE,
      command.startDate,
      command.endDate,
      command.budget,
      command.avatar,
      command.color,
      command.metadata,
    );

    return this.projectRepository.create(project);
  }
}
