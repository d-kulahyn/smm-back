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
exports.ProjectController = exports.UpdateProjectDto = exports.CreateProjectDto = exports.ErrorResponseDto = exports.MessageResponseDto = exports.ProjectStatsResponseDto = exports.ProjectCreateResponseDto = exports.ProjectListResponseDto = exports.ProjectResponseDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const shared_2 = require("../../../shared");
const shared_3 = require("../../../shared");
const shared_4 = require("../../../shared");
const create_project_use_case_1 = require("../../../application/use-cases/create-project.use-case");
const complete_project_use_case_1 = require("../../../application/use-cases/complete-project.use-case");
const get_project_stats_use_case_1 = require("../../../application/use-cases/get-project-stats.use-case");
const project_status_enum_1 = require("../../../domain/enums/project-status.enum");
const pagination_params_dto_1 = require("../resources/pagination-params.dto");
const project_resource_dto_1 = require("../resources/project-resource.dto");
const shared_5 = require("../../../shared");
class ProjectResponseDto {
}
exports.ProjectResponseDto = ProjectResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1abc123def456' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Project' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project description', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1owner123456' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000, nullable: true }),
    __metadata("design:type", Number)
], ProjectResponseDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'avatar.jpg', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FF5733', nullable: true }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], ProjectResponseDto.prototype, "updatedAt", void 0);
class ProjectListResponseDto {
}
exports.ProjectListResponseDto = ProjectListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProjectListResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProjectResponseDto] }),
    __metadata("design:type", Array)
], ProjectListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        properties: {
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 3 }
        }
    }),
    __metadata("design:type", Object)
], ProjectListResponseDto.prototype, "pagination", void 0);
class ProjectCreateResponseDto {
}
exports.ProjectCreateResponseDto = ProjectCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProjectCreateResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project created successfully' }),
    __metadata("design:type", String)
], ProjectCreateResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProjectResponseDto }),
    __metadata("design:type", ProjectResponseDto)
], ProjectCreateResponseDto.prototype, "data", void 0);
class ProjectStatsResponseDto {
}
exports.ProjectStatsResponseDto = ProjectStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "totalProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "activeProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "completedProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "onHoldProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "completedTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7 }),
    __metadata("design:type", Number)
], ProjectStatsResponseDto.prototype, "pendingTasks", void 0);
class MessageResponseDto {
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Operation completed successfully' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "message", void 0);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bad Request' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Validation failed' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project name', example: 'My Project' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: project_status_enum_1.ProjectStatus, description: 'Project status' }),
    (0, class_validator_1.IsEnum)(project_status_enum_1.ProjectStatus),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project start date', required: false, type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project end date', required: false, type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project budget', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project color', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary', description: 'Project avatar image', required: false }),
    __metadata("design:type", Object)
], CreateProjectDto.prototype, "avatar", void 0);
class UpdateProjectDto {
}
exports.UpdateProjectDto = UpdateProjectDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(project_status_enum_1.ProjectStatus),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProjectDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "color", void 0);
let ProjectController = class ProjectController {
    constructor(createProjectUseCase, completeProjectUseCase, getProjectStatsUseCase, fileService, projectPolicy, projectRepository, userRepository) {
        this.createProjectUseCase = createProjectUseCase;
        this.completeProjectUseCase = completeProjectUseCase;
        this.getProjectStatsUseCase = getProjectStatsUseCase;
        this.fileService = fileService;
        this.projectPolicy = projectPolicy;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async index(req, page, perPage) {
        const paginationParams = pagination_params_dto_1.PaginationParamsDto.fromQuery(page, perPage);
        const paginatedResult = await this.projectRepository.findByUserIdPaginated(req.user.userId, paginationParams.page, paginationParams.perPage);
        const user = await this.userRepository.findById(req.user.userId);
        const filteredProjects = paginatedResult.data.filter(project => this.projectPolicy.view(user, project));
        const projectIds = filteredProjects.map(p => p.id);
        const statsMap = await this.getProjectStatsUseCase.execute(projectIds);
        const projectsWithStats = filteredProjects.map(project => {
            const stats = statsMap.get(project.id);
            if (stats) {
                project.setStats(stats);
            }
            return project;
        });
        const projectResources = project_resource_dto_1.ProjectResource.collection(projectsWithStats);
        return {
            success: true,
            data: projectResources,
            meta: {
                ...paginatedResult.meta,
                total: filteredProjects.length
            }
        };
    }
    async store(createProjectDto, req, avatar) {
        let avatarPath;
        if (avatar) {
            try {
                avatarPath = await this.fileService.saveAvatar(avatar);
            }
            catch (error) {
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
                data: project_resource_dto_1.ProjectResource.fromEntity(project)
            };
        }
        catch (error) {
            if (avatarPath) {
                await this.fileService.deleteAvatar(avatarPath);
            }
            throw error;
        }
    }
    async show(id, req) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.projectPolicy.view(user, project)) {
            throw new common_1.ForbiddenException('You do not have permission to view this project');
        }
        const stats = await this.getProjectStatsUseCase.getForSingleProject(id);
        project.setStats(stats);
        return {
            success: true,
            data: project_resource_dto_1.ProjectResource.fromEntity(project)
        };
    }
    async update(id, updateProjectDto, req) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.projectPolicy.update(user, project)) {
            throw new common_1.ForbiddenException('You do not have permission to update this project');
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
            data: project_resource_dto_1.ProjectResource.fromEntity(updatedProject)
        };
    }
    async destroy(id, req) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const user = await this.userRepository.findById(req.user.userId);
        if (!this.projectPolicy.delete(user, project)) {
            throw new common_1.ForbiddenException('You do not have permission to delete this project');
        }
        await this.projectRepository.delete(id);
        return {
            success: true,
            message: 'Project deleted successfully'
        };
    }
    async complete(id) {
        const completedProject = await this.completeProjectUseCase.execute(id);
        return project_resource_dto_1.ProjectResource.fromEntity(completedProject);
    }
    async putOnHold(id) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const updatedProject = project.putOnHold();
        const result = await this.projectRepository.update(id, updatedProject);
        return project_resource_dto_1.ProjectResource.fromEntity(result);
    }
    async cancel(id) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const cancelledProject = project.cancel();
        const result = await this.projectRepository.update(id, cancelledProject);
        return project_resource_dto_1.ProjectResource.fromEntity(result);
    }
    async archive(id) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        const archivedProject = project.archive();
        const result = await this.projectRepository.update(id, archivedProject);
        return project_resource_dto_1.ProjectResource.fromEntity(result);
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Get)(),
    (0, shared_2.RequireAnyPermission)(shared_3.Permission.MANAGE_ALL_PROJECTS, shared_3.Permission.MANAGE_ASSIGNED_PROJECTS, shared_3.Permission.VIEW_OWN_PROJECTS, shared_3.Permission.VIEW_ASSIGNED_PROJECTS),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of projects',
        description: 'Retrieve paginated list of projects with authorization checks'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectListResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    (0, shared_2.RequireAnyPermission)(shared_3.Permission.MANAGE_ALL_PROJECTS, shared_3.Permission.CREATE_PROJECTS),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new project',
        description: 'Create a new project with authorization checks'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, swagger_1.ApiResponse)({ status: 201, type: ProjectCreateResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get project details',
        description: 'Retrieve detailed project information with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update project',
        description: 'Update project with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete project',
        description: 'Delete project with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: MessageResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "destroy", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark project as on_hold',
        description: 'Change project status to on_hold'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/hold'),
    (0, swagger_1.ApiOperation)({
        summary: 'Put project on hold',
        description: 'Change project status to on hold'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "putOnHold", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel project',
        description: 'Change project status to cancelled'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/archive'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive project',
        description: 'Change project status to archived'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "archive", null);
exports.ProjectController = ProjectController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, shared_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(5, (0, common_1.Inject)('PROJECT_REPOSITORY')),
    __param(6, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [create_project_use_case_1.CreateProjectUseCase,
        complete_project_use_case_1.CompleteProjectUseCase,
        get_project_stats_use_case_1.GetProjectStatsUseCase,
        shared_5.FileService,
        shared_4.ProjectPolicy, Object, Object])
], ProjectController);
//# sourceMappingURL=project.controller.js.map