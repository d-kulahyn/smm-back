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
  Query,
  Patch,
  ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequireAnyPermission,
  Permission,
  TaskPolicy,
  AuthenticatedRequest
} from '../../../shared';
import { CreateTaskUseCase } from '../../../application/use-cases/create-task.use-case';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { TaskPriority, TaskStatus } from '../../../domain/enums';
import { PaginationParamsDto } from '../resources/pagination-params.dto';
import { TaskResource } from '../resources/task-resource.dto';
import { ResourceNotFoundException, AccessDeniedException } from '../../../shared/exceptions';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Complete project documentation' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Project ID where task belongs' })
  @IsString()
  project_id: string;

  @ApiProperty({ enum: TaskPriority, description: 'Task priority', required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, description: 'Task status', required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ description: 'Task due date', required: false, type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'User ID to assign task to', required: false })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Reminder time in hours before the due date', required: false })
  @IsOptional()
  reminderBeforeHours?: number;
}

export class UpdateTaskDto {
  @ApiProperty({ description: 'Task title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskPriority, description: 'Task priority', required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, description: 'Task status', required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ description: 'Task due date', required: false, type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'User ID to assign task to', required: false })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateTaskReminderDto {
  @ApiProperty({ description: 'When to remind', type: 'string', format: 'date-time' })
  @IsDateString()
  remindAt: string;

  @ApiProperty({ description: 'Reminder message', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

// Response DTOs для Swagger документации
export class TaskResponseDto {
  @ApiProperty({ example: 'clm1abc123def456' })
  id: string;

  @ApiProperty({ example: 'Complete project documentation' })
  title: string;

  @ApiProperty({ example: 'Write comprehensive docs for the project', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 'high' })
  priority: string;

  @ApiProperty({ example: 'clm1project123456' })
  project_id: string;

  @ApiProperty({ example: 'clm1user123456', nullable: true })
  assigned_to: string | null;

  @ApiProperty({ example: '2024-12-31', nullable: true })
  due_date: string | null;

  @ApiProperty({ example: null, nullable: true })
  completed_at: string | null;

  @ApiProperty({ example: 'Additional notes', nullable: true })
  notes: string | null;

  @ApiProperty({ example: false })
  is_completed: boolean;

  @ApiProperty({ example: false })
  is_overdue: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: string;
}

export class TaskListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number', example: 25 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 }
    }
  })
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export class TaskCreateResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Task created successfully' })
  message: string;

  @ApiProperty({ type: TaskResponseDto })
  data: TaskResponseDto;
}

export class TaskStatsResponseDto {
  @ApiProperty({ example: 25 })
  total_tasks: number;

  @ApiProperty({ example: 10 })
  completed_tasks: number;

  @ApiProperty({ example: 12 })
  pending_tasks: number;

  @ApiProperty({ example: 3 })
  in_progress_tasks: number;

  @ApiProperty({ example: 2 })
  overdue_tasks: number;

  @ApiProperty({ example: 40 })
  completion_rate: number;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Task updated successfully' })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 'Validation failed' })
  message: string;
}

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly taskPolicy: TaskPolicy,
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  @RequireAnyPermission(
    Permission.MANAGE_ALL_TASKS,
    Permission.MANAGE_PROJECT_TASKS,
    Permission.VIEW_ASSIGNED_TASKS
  )
  @ApiOperation({
    summary: 'Get list of tasks',
    description: 'Retrieve paginated list of user tasks with authorization checks'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'per_page', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'project_id', required: false, type: String, description: 'Filter by project ID' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority, description: 'Filter by priority' })
  @ApiQuery({ name: 'assigned_to', required: false, type: String, description: 'Filter by assigned user ID' })
  @ApiQuery({ name: 'overdue', required: false, type: Boolean, description: 'Filter overdue tasks' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in task title and description' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: TaskListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to view tasks', type: ErrorResponseDto })
  async index(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
    @Query('project_id') projectId?: string,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('assigned_to') assignedTo?: string,
    @Query('overdue') overdue?: string,
    @Query('search') search?: string
  ) {
    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.viewAny(user)) {
      throw new ForbiddenException('You do not have permission to view tasks');
    }

    const paginationParams = PaginationParamsDto.fromQuery(page, perPage);

    const paginatedResult = await this.taskRepository.findByCreatorIdPaginated(
      req.user.userId,
      paginationParams.page,
      paginationParams.perPage,
      {
        projectId,
        status,
        priority,
        assignedTo,
        overdue: overdue === 'true',
        search
      }
    );

    const filteredTasks = paginatedResult.data.filter(task =>
      this.taskPolicy.view(user, task)
    );

    const taskResources = TaskResource.collection(filteredTasks);

    return {
      success: true,
      data: taskResources,
      pagination: {
        ...paginatedResult.meta,
        total: filteredTasks.length
      }
    };
  }

  @Post()
  @RequireAnyPermission(
    Permission.MANAGE_ALL_TASKS,
    Permission.MANAGE_PROJECT_TASKS,
    Permission.CREATE_TASKS
  )
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new task with authorization checks'
  })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskCreateResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Project ID is required or invalid data', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to create tasks', type: ErrorResponseDto })
  async store(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const rawBody = req.body as any;
    const mappedDto = {
      title: createTaskDto.title || rawBody.title,
      description: createTaskDto.description || rawBody.description,
      projectId: createTaskDto.project_id || rawBody.project_id || rawBody.projectId,
      priority: createTaskDto.priority || rawBody.priority,
      status: createTaskDto.status || rawBody.status,
      dueDate: createTaskDto.dueDate || rawBody.dueDate || rawBody.due_date,
      assignedTo: createTaskDto.assignedTo || rawBody.assignedTo || rawBody.assigned_to,
      notes: createTaskDto.notes || rawBody.notes,
      reminderBeforeHours: createTaskDto.reminderBeforeHours || rawBody.reminderBeforeHours || rawBody.reminder_before_hours
    };

    console.log('Mapped DTO:', mappedDto);
    console.log('Original body:', rawBody);

    // Валидируем обязательные поля
    if (!mappedDto.projectId) {
      throw new Error('Project ID is required');
    }

    const user = await this.userRepository.findById(req.user.userId);

    // Проверяем права на создание задач
    if (!this.taskPolicy.create(user)) {
      throw new ForbiddenException('You do not have permission to create tasks');
    }

    try {
      const task = await this.createTaskUseCase.execute({
        title: mappedDto.title,
        description: mappedDto.description,
        projectId: mappedDto.projectId,
        creatorId: req.user.userId,
        priority: mappedDto.priority,
        status: mappedDto.status,
        dueDate: mappedDto.dueDate ? new Date(mappedDto.dueDate) : undefined,
        reminderBeforeHours: mappedDto.reminderBeforeHours
      });

      return {
        success: true,
        message: 'Task created successfully',
        data: TaskResource.fromEntity(task)
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task details',
    description: 'Retrieve detailed task information with authorization checks'
  })
  @ApiResponse({ status: 200, description: 'Task details retrieved successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to view this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async show(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.view(user, task)) {
      throw new ForbiddenException('You do not have permission to view this task');
    }

    return {
      success: true,
      data: TaskResource.fromEntity(task)
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update task',
    description: 'Update task with authorization checks'
  })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to update this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest
  ) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.update(user, task)) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    const updateData = {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
    };

    const updatedTask = await this.taskRepository.update(id, updateData);

    return {
      success: true,
      message: 'Task updated successfully',
      data: TaskResource.fromEntity(updatedTask)
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task',
    description: 'Delete task with authorization checks'
  })
  @ApiResponse({ status: 200, description: 'Task deleted successfully', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to delete this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async destroy(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.delete(user, task)) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    // Удаляем задачу
    await this.taskRepository.delete(id);

    return {
      success: true,
      message: 'Task deleted successfully'
    };
  }

  @Patch(':id/status')
  @RequireAnyPermission(
    Permission.MANAGE_ALL_TASKS,
    Permission.MANAGE_PROJECT_TASKS,
    Permission.UPDATE_TASK_STATUS
  )
  @ApiOperation({
    summary: 'Change task status',
    description: 'Change task status with authorization checks'
  })
  @ApiResponse({ status: 200, description: 'Task status changed successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to change task status', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus },
    @Request() req: AuthenticatedRequest
  ) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.updateStatus(user, task)) {
      throw new ForbiddenException('You do not have permission to change task status');
    }

    const updatedTask = await this.taskRepository.update(id, {
      status: body.status,
      completedAt: body.status === TaskStatus.completed ? new Date() : null
    });

    return {
      success: true,
      message: `Task status changed to ${body.status}`,
      data: TaskResource.fromEntity(updatedTask)
    };
  }

  @Patch(':id/assign')
  @ApiOperation({
    summary: 'Assign task to user',
    description: 'Assign task with authorization checks'
  })
  @ApiResponse({ status: 200, description: 'Task assigned successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid user ID', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to assign this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async assign(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Request() req: AuthenticatedRequest
  ) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.assign(user, task)) {
      throw new ForbiddenException('You do not have permission to assign this task');
    }

    const updatedTask = await this.taskRepository.update(id, { assignedTo: userId });

    return {
      success: true,
      message: 'Task assigned successfully',
      data: TaskResource.fromEntity(updatedTask)
    };
  }

  @Post(':taskId/reminders')
  @ApiOperation({
    summary: 'Create task reminder',
    description: 'Create a reminder for a specific task with hours before logic'
  })
  @ApiResponse({
    status: 201,
    description: 'Reminder created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Reminder created successfully' },
        data: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            remindAt: { type: 'string', format: 'date-time' },
            message: { type: 'string', nullable: true },
            hours_before: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Task must have a due date', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to create reminders for this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async createReminder(
    @Param('taskId') taskId: string,
    @Body() body: { hours_before: number; message?: string },
    @Request() req: AuthenticatedRequest
  ) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.createReminder(user, task)) {
      throw new ForbiddenException('You do not have permission to create reminders for this task');
    }

    if (!task.dueDate) {
      throw new Error('Task must have a due date to create reminder');
    }

    const remindAt = new Date(task.dueDate);
    remindAt.setHours(remindAt.getHours() - body.hours_before);

    return {
      success: true,
      message: 'Reminder created successfully',
      data: {
        taskId,
        remindAt: remindAt.toISOString(),
        message: body.message,
        hours_before: body.hours_before
      }
    };
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Get overdue tasks',
    description: 'Retrieve all overdue tasks for the current user'
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'array', items: { $ref: '#/components/schemas/TaskResponseDto' } },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            overdue_count: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  async getOverdueTasks(@Request() req: AuthenticatedRequest) {
    const overdueTasks = await this.taskRepository.findOverdueByUserId(req.user.userId);

    return {
      success: true,
      data: TaskResource.collection(overdueTasks),
      meta: {
        total: overdueTasks.length,
        overdue_count: overdueTasks.length
      }
    };
  }

  @Get('assigned-to-me')
  @ApiOperation({
    summary: 'Get tasks assigned to current user',
    description: 'Retrieve all tasks assigned to the current user'
  })
  @ApiResponse({ status: 200, description: 'Assigned tasks retrieved successfully', type: TaskListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  async getAssignedToMe(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string
  ) {
    const paginationParams = PaginationParamsDto.fromQuery(page, perPage);

    const paginatedResult = await this.taskRepository.findByAssignedTo(
      req.user.userId,
      paginationParams.page,
      paginationParams.perPage
    );

    return {
      success: true,
      data: TaskResource.collection(paginatedResult.data),
      pagination: paginatedResult.meta
    };
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get task statistics',
    description: 'Get task statistics for the current user'
  })
  @ApiResponse({
    status: 200,
    description: 'Task statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/TaskStatsResponseDto' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  async getStatistics(@Request() req: AuthenticatedRequest) {
    const stats = await this.taskRepository.getUserTaskStatistics(req.user.userId);

    return {
      success: true,
      data: {
        total_tasks: stats.total,
        completed_tasks: stats.completed,
        pending_tasks: stats.pending,
        in_progress_tasks: stats.inProgress,
        overdue_tasks: stats.overdue,
        completion_rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      }
    };
  }

  @Patch(':id/priority')
  @ApiOperation({
    summary: 'Change task priority',
    description: 'Change the priority of a specific task'
  })
  @ApiResponse({ status: 200, description: 'Task priority changed successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid priority', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to change priority of this task', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found', type: ErrorResponseDto })
  async changePriority(
    @Param('id') id: string,
    @Body() body: { priority: TaskPriority },
    @Request() req: AuthenticatedRequest
  ) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const user = await this.userRepository.findById(req.user.userId);

    if (!this.taskPolicy.changePriority(user, task)) {
      throw new ForbiddenException('You do not have permission to change priority of this task');
    }

    const updatedTask = await this.taskRepository.update(id, { priority: body.priority });

    return {
      success: true,
      message: `Task priority changed to ${body.priority}`,
      data: TaskResource.fromEntity(updatedTask)
    };
  }
}
