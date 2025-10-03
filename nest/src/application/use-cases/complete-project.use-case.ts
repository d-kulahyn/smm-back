import { Injectable, Inject } from '@nestjs/common';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class CompleteProjectUseCase {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const completedProject = project.complete();
    return this.projectRepository.update(projectId, completedProject);
  }
}
