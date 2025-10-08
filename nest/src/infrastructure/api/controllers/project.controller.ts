import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Inject,
  UploadedFile,
  UseInterceptors,
  Query,
  Patch,
  ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared';
import { RequireAnyPermission } from '../../../shared';
import { Permission } from '../../../shared';
import { ProjectPolicy } from '../../../shared';
import { AuthenticatedRequest } from '../../../shared';
import { CreateProjectUseCase } from '../../../application/use-cases/create-project.use-case';
import { CompleteProjectUseCase } from '../../../application/use-cases/complete-project.use-case';
import { GetProjectStatsUseCase } from '../../../application/use-cases/get-project-stats.use-case';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectStatus } from '../../../domain/enums/project-status.enum';
import { PaginationParamsDto } from '../resources/pagination-params.dto';
import { ProjectResource } from '../resources/project-resource.dto';
import { FileService } from '../../../shared';

// Request DTOs
import {
  CreateProjectDto,
  UpdateProjectDto
} from '../requests';

// Response DTOs
import {
  ProjectResponseDto,
  ProjectListResponseDto,
  ProjectCreateResponseDto,
  ProjectStatsResponseDto,
  MessageResponseDto,
  ErrorResponseDto
} from '../responses';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly completeProjectUseCase: CompleteProjectUseCase,
    private readonly getProjectStatsUseCase: GetProjectStatsUseCase,
    private readonly fileService: FileService,
    private readonly projectPolicy: ProjectPolicy,
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: ProjectRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  @RequireAnyPermission(
    Permission.MANAGE_ALL_PROJECTS,
    Permission.MANAGE_ASSIGNED_PROJECTS,
    Permission.VIEW_OWN_PROJECTS,
    Permission.VIEW_ASSIGNED_PROJECTS
  )
  @ApiOperation({
    summary: 'Get list of projects',
    description: 'Retrieve paginated list of projects with authorization checks'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'per_page', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiResponse({ status: 200, type: ProjectListResponseDto })
  async index(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string
  ) {
    const paginationParams = PaginationParamsDto.fromQuery(page, perPage);

    const paginatedResult = await this.projectRepository.findByUserIdPaginated(
      req.user.userId,
      paginationParams.page,
      paginationParams.perPage
    );

    const user = await this.userRepository.findById(req.user.userId);
    const filteredProjects = paginatedResult.data.filter(project =>
      this.projectPolicy.view(user, project)
    );

    const projectIds = filteredProjects.map(p => p.id);
    const statsMap = await this.getProjectStatsUseCase.execute(projectIds);

    const projectsWithStats = filteredProjects.map(project => {
      const stats = statsMap.get(project.id);
      if (stats) {
        project.setStats(stats);
      }
      return project;
    });

    const projectResources = ProjectResource.collection(projectsWithStats);

    return {
      success: true,
      data: projectResources,
      meta: {
        ...paginatedResult.meta,
        total: filteredProjects.length
      }
    };
  }

  @Post()
  @RequireAnyPermission(Permission.MANAGE_ALL_PROJECTS, Permission.CREATE_PROJECTS)
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new project with authorization checks'
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({ status: 201, type: ProjectCreateResponseDto })
  async store(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile() avatar?: Express.Multer.File
  ) {
    let avatarPath: string | undefined;

    if (avatar) {
      try {
        avatarPath = await this.fileService.saveAvatar(avatar);
      } catch (error) {
        throw new Error(`Failed to save avatar: ${error.message}`);
      }
    }

    try {
      const project = await this.createProjectUseCase.execute({
        ...createProjectDto,
        ownerId: req.user.userId,
        startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
        endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : undefined,
        avatar: avatarPath,
      });

      return {
        success: true,
        message: 'Project created successfully',
        data: ProjectResource.fromEntity(project)
      };
    } catch (error) {
      if (avatarPath) {
        await this.fileService.deleteAvatar(avatarPath);
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project details',
    description: 'Retrieve detailed project information with authorization checks'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async show(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.projectPolicy.view(user, project)) {
      throw new ForbiddenException('You do not have permission to view this project');
    }

    const stats = await this.getProjectStatsUseCase.getForSingleProject(id);
    project.setStats(stats);

    return {
      success: true,
      data: ProjectResource.fromEntity(project)
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update project with authorization checks'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: AuthenticatedRequest
  ) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.projectPolicy.update(user, project)) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    const updateData = {
      ...updateProjectDto,
      startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : undefined,
      endDate: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : undefined,
    };

    const updatedProject = await this.projectRepository.update(id, updateData);

    return {
      success: true,
      message: 'Project updated successfully',
      data: ProjectResource.fromEntity(updatedProject)
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project',
    description: 'Delete project with authorization checks'
  })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async destroy(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.projectPolicy.delete(user, project)) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepository.delete(id);

    return {
      success: true,
      message: 'Project deleted successfully'
    };
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Mark project as on_hold',
    description: 'Change project status to on_hold'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async complete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const completedProject = await this.completeProjectUseCase.execute(id, req.user.userId);
    return ProjectResource.fromEntity(completedProject);
  }

  @Patch(':id/hold')
  @ApiOperation({
    summary: 'Put project on hold',
    description: 'Change project status to on hold'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async putOnHold(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedProject = project.putOnHold();
    const result = await this.projectRepository.update(id, updatedProject);
    return ProjectResource.fromEntity(result);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel project',
    description: 'Change project status to cancelled'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async cancel(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const cancelledProject = project.cancel();
    const result = await this.projectRepository.update(id, cancelledProject);
    return ProjectResource.fromEntity(result);
  }

  @Patch(':id/archive')
  @ApiOperation({
    summary: 'Archive project',
    description: 'Change project status to archived'
  })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async archive(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectRepository.findById(id, req.user.userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const archivedProject = project.archive();
    const result = await this.projectRepository.update(id, archivedProject);
    return ProjectResource.fromEntity(result);
  }
}
