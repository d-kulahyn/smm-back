"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const create_task_use_case_1 = require("../../../application/use-cases/create-task.use-case");
const enums_1 = require("../../../domain/enums");
const pagination_params_dto_1 = require("../resources/pagination-params.dto");
const task_resource_dto_1 = require("../resources/task-resource.dto");
const requests_1 = require("../requests");
const responses_1 = require("../responses");
let TaskController = class TaskController {
    constructor(createTaskUseCase, taskPolicy, taskRepository, userRepository) {
        this.createTaskUseCase = createTaskUseCase;
        this.taskPolicy = taskPolicy;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    async index(req, page, perPage, projectId, status, priority, assignedTo, overdue, search) {
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.viewAny(user)) {
            throw new common_1.ForbiddenException('You do not have permission to view tasks');
        }
        const paginationParams = pagination_params_dto_1.PaginationParamsDto.fromQuery(page, perPage);
        const paginatedResult = await this.taskRepository.findByCreatorIdPaginated(req.user.userId, paginationParams.page, paginationParams.perPage, {
            projectId,
            status,
            priority,
            assignedTo,
            overdue: overdue === 'true',
            search
        });
        const filteredTasks = paginatedResult.data.filter(task => this.taskPolicy.view(user, task));
        const taskResources = task_resource_dto_1.TaskResource.collection(filteredTasks);
        return {
            success: true,
            data: taskResources,
            pagination: {
                ...paginatedResult.meta,
                total: filteredTasks.length
            }
        };
    }
    async store(createTaskDto, req) {
        const rawBody = req.body;
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
        if (!mappedDto.projectId) {
            throw new Error('Project ID is required');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.create(user)) {
            throw new common_1.ForbiddenException('You do not have permission to create tasks');
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
                data: task_resource_dto_1.TaskResource.fromEntity(task)
            };
        }
        catch (error) {
            throw error;
        }
    }
    async show(id, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.view(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to view this task');
        }
        return {
            success: true,
            data: task_resource_dto_1.TaskResource.fromEntity(task)
        };
    }
    async update(id, updateTaskDto, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.update(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to update this task');
        }
        const updateData = {
            ...updateTaskDto,
            dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
        };
        const updatedTask = await this.taskRepository.update(id, updateData);
        return {
            success: true,
            message: 'Task updated successfully',
            data: task_resource_dto_1.TaskResource.fromEntity(updatedTask)
        };
    }
    async destroy(id, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.delete(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to delete this task');
        }
        await this.taskRepository.delete(id);
        return {
            success: true,
            message: 'Task deleted successfully'
        };
    }
    async changeStatus(id, body, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.updateStatus(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to change task status');
        }
        const updatedTask = await this.taskRepository.update(id, {
            status: body.status,
            completedAt: body.status === enums_1.TaskStatus.completed ? new Date() : null
        });
        return {
            success: true,
            message: `Task status changed to ${body.status}`,
            data: task_resource_dto_1.TaskResource.fromEntity(updatedTask)
        };
    }
    async assign(id, userId, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.assign(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to assign this task');
        }
        const updatedTask = await this.taskRepository.update(id, { assignedTo: userId });
        return {
            success: true,
            message: 'Task assigned successfully',
            data: task_resource_dto_1.TaskResource.fromEntity(updatedTask)
        };
    }
    async createReminder(taskId, body, req) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.createReminder(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to create reminders for this task');
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
    async getOverdueTasks(req) {
        const overdueTasks = await this.taskRepository.findOverdueByUserId(req.user.userId);
        return {
            success: true,
            data: task_resource_dto_1.TaskResource.collection(overdueTasks),
            meta: {
                total: overdueTasks.length,
                overdue_count: overdueTasks.length
            }
        };
    }
    async getAssignedToMe(req, page, perPage) {
        const paginationParams = pagination_params_dto_1.PaginationParamsDto.fromQuery(page, perPage);
        const paginatedResult = await this.taskRepository.findByAssignedTo(req.user.userId, paginationParams.page, paginationParams.perPage);
        return {
            success: true,
            data: task_resource_dto_1.TaskResource.collection(paginatedResult.data),
            pagination: paginatedResult.meta
        };
    }
    async getStatistics(req) {
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
    async changePriority(id, body, req) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.taskPolicy.changePriority(user, task)) {
            throw new common_1.ForbiddenException('You do not have permission to change priority of this task');
        }
        const updatedTask = await this.taskRepository.update(id, { priority: body.priority });
        return {
            success: true,
            message: `Task priority changed to ${body.priority}`,
            data: task_resource_dto_1.TaskResource.fromEntity(updatedTask)
        };
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Get)(),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_TASKS, shared_1.Permission.MANAGE_PROJECT_TASKS, shared_1.Permission.VIEW_ASSIGNED_TASKS),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of tasks',
        description: 'Retrieve paginated list of user tasks with authorization checks'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'project_id', required: false, type: String, description: 'Filter by project ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: enums_1.TaskStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false, enum: enums_1.TaskPriority, description: 'Filter by priority' }),
    (0, swagger_1.ApiQuery)({ name: 'assigned_to', required: false, type: String, description: 'Filter by assigned user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'overdue', required: false, type: Boolean, description: 'Filter overdue tasks' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search in task title and description' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved successfully', type: responses_1.TaskListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view tasks', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('per_page')),
    __param(3, (0, common_1.Query)('project_id')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('priority')),
    __param(6, (0, common_1.Query)('assigned_to')),
    __param(7, (0, common_1.Query)('overdue')),
    __param(8, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_TASKS, shared_1.Permission.MANAGE_PROJECT_TASKS, shared_1.Permission.CREATE_TASKS),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new task',
        description: 'Create a new task with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully', type: responses_1.TaskCreateResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Project ID is required or invalid data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to create tasks', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get task details',
        description: 'Retrieve detailed task information with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task details retrieved successfully', type: responses_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to view this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update task',
        description: 'Update task with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully', type: responses_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to update this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete task',
        description: 'Delete task with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted successfully', type: responses_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to delete this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "destroy", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, shared_1.RequireAnyPermission)(shared_1.Permission.MANAGE_ALL_TASKS, shared_1.Permission.MANAGE_PROJECT_TASKS, shared_1.Permission.UPDATE_TASK_STATUS),
    (0, swagger_1.ApiOperation)({
        summary: 'Change task status',
        description: 'Change task status with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status changed successfully', type: responses_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid status', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to change task status', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign task to user',
        description: 'Assign task with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task assigned successfully', type: responses_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid user ID', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to assign this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)(':taskId/reminders'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create task reminder',
        description: 'Create a reminder for a specific task with hours before logic'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Task must have a due date', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to create reminders for this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createReminder", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get overdue tasks',
        description: 'Retrieve all overdue tasks for the current user'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getOverdueTasks", null);
__decorate([
    (0, common_1.Get)('assigned-to-me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tasks assigned to current user',
        description: 'Retrieve all tasks assigned to the current user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assigned tasks retrieved successfully', type: responses_1.TaskListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getAssignedToMe", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get task statistics',
        description: 'Get task statistics for the current user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: { $ref: '#/components/schemas/TaskStatsResponseDto' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Patch)(':id/priority'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change task priority',
        description: 'Change the priority of a specific task'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task priority changed successfully', type: responses_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid priority', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - No permission to change priority of this task', type: responses_1.ErrorResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found', type: responses_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "changePriority", null);
exports.TaskController = TaskController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, shared_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(2, (0, common_1.Inject)('TASK_REPOSITORY')),
    __param(3, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [create_task_use_case_1.CreateTaskUseCase,
        shared_1.TaskPolicy, Object, Object])
], TaskController);
//# sourceMappingURL=task.controller.js.map