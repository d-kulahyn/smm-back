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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const shared_1 = require("../../../shared");
const shared_2 = require("../../../shared");
const shared_3 = require("../../../shared");
const shared_4 = require("../../../shared");
const create_project_use_case_1 = require("../../../application/use-cases/create-project.use-case");
const complete_project_use_case_1 = require("../../../application/use-cases/complete-project.use-case");
const get_project_stats_use_case_1 = require("../../../application/use-cases/get-project-stats.use-case");
const pagination_params_dto_1 = require("../resources/pagination-params.dto");
const project_resource_dto_1 = require("../resources/project-resource.dto");
const shared_5 = require("../../../shared");
const requests_1 = require("../requests");
const responses_1 = require("../responses");
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
        const project = await this.projectRepository.findById(id, req.user.userId);
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
        const project = await this.projectRepository.findById(id, req.user.userId);
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
        const project = await this.projectRepository.findById(id, req.user.userId);
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
    async complete(id, req) {
        const completedProject = await this.completeProjectUseCase.execute(id, req.user.userId);
        return project_resource_dto_1.ProjectResource.fromEntity(completedProject);
    }
    async putOnHold(id, req) {
        const project = await this.projectRepository.findById(id, req.user.userId);
        if (!project) {
            throw new Error('Project not found');
        }
        const updatedProject = project.putOnHold();
        const result = await this.projectRepository.update(id, updatedProject);
        return project_resource_dto_1.ProjectResource.fromEntity(result);
    }
    async cancel(id, req) {
        const project = await this.projectRepository.findById(id, req.user.userId);
        if (!project) {
            throw new Error('Project not found');
        }
        const cancelledProject = project.cancel();
        const result = await this.projectRepository.update(id, cancelledProject);
        return project_resource_dto_1.ProjectResource.fromEntity(result);
    }
    async archive(id, req) {
        const project = await this.projectRepository.findById(id, req.user.userId);
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
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectListResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 201, type: responses_1.ProjectCreateResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_1.CreateProjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get project details',
        description: 'Retrieve detailed project information with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete project',
        description: 'Delete project with authorization checks'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.MessageResponseDto }),
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
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/hold'),
    (0, swagger_1.ApiOperation)({
        summary: 'Put project on hold',
        description: 'Change project status to on hold'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "putOnHold", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel project',
        description: 'Change project status to cancelled'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/archive'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive project',
        description: 'Change project status to archived'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: responses_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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