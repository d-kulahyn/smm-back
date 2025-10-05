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
exports.ProjectInvitationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const send_project_invitation_use_case_1 = require("../../../application/use-cases/send-project-invitation.use-case");
const accept_project_invitation_use_case_1 = require("../../../application/use-cases/accept-project-invitation.use-case");
const decline_project_invitation_use_case_1 = require("../../../application/use-cases/decline-project-invitation.use-case");
const prisma_project_invitation_repository_1 = require("../../repositories/prisma-project-invitation.repository");
const project_invitation_dto_1 = require("../dto/project-invitation.dto");
const prisma_user_repository_1 = require("../../repositories/prisma-user.repository");
let ProjectInvitationController = class ProjectInvitationController {
    constructor(invitationRepository, userRepository, sendInvitationUseCase, acceptInvitationUseCase, declineInvitationUseCase) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.sendInvitationUseCase = sendInvitationUseCase;
        this.acceptInvitationUseCase = acceptInvitationUseCase;
        this.declineInvitationUseCase = declineInvitationUseCase;
    }
    async getProjectInvitations(projectId, paginationDto) {
        const page = parseInt(paginationDto.page?.toString() || '1', 10);
        const perPage = parseInt(paginationDto.perPage?.toString() || '15', 10);
        const result = await this.invitationRepository.findByProjectIdPaginated(projectId, page, perPage);
        const totalPages = Math.ceil(result.total / perPage);
        return {
            data: result.data,
            pagination: {
                page,
                perPage,
                total: result.total,
                totalPages
            }
        };
    }
    async sendInvitation(projectId, dto, req) {
        const invitationDto = new project_invitation_dto_1.SendProjectInvitationUseCaseDto();
        invitationDto.projectId = projectId;
        invitationDto.invitedBy = req.user.userId;
        invitationDto.invitedEmail = dto.email;
        invitationDto.role = dto.role;
        invitationDto.permissions = dto.permissions;
        const result = await this.sendInvitationUseCase.execute(invitationDto);
        return {
            message: 'Invitation sent successfully',
            invitation: {
                id: result.invitation.id,
                token: result.invitation.token,
                projectId: result.invitation.projectId,
                invitedEmail: result.invitation.invitedEmail,
                role: result.invitation.role,
                permissions: result.invitation.permissions,
                expiresAt: result.invitation.expiresAt
            },
            links: {
                accept: result.acceptUrl,
                decline: result.declineUrl
            },
            emailSent: !!dto.email
        };
    }
    async acceptInvitation(token, req) {
        const acceptDto = new project_invitation_dto_1.AcceptProjectInvitationUseCaseDto();
        acceptDto.token = token;
        acceptDto.userId = req.user.id;
        return this.acceptInvitationUseCase.execute(acceptDto);
    }
    async declineInvitation(token) {
        return this.declineInvitationUseCase.execute(token);
    }
    async getMyInvitations(paginationDto, req) {
        const page = parseInt(paginationDto.page?.toString() || '1', 10);
        const perPage = parseInt(paginationDto.perPage?.toString() || '15', 10);
        const result = await this.invitationRepository.findByUserEmailPaginated(req.user.email, page, perPage);
        const totalPages = Math.ceil(result.total / perPage);
        return {
            data: result.data,
            pagination: {
                page,
                perPage,
                total: result.total,
                totalPages
            }
        };
    }
};
exports.ProjectInvitationController = ProjectInvitationController;
__decorate([
    (0, common_1.Get)('projects/:projectId/invitations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get project invitations',
        description: 'Retrieve paginated list of invitations for a specific project'
    }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID', type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'perPage', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful operation'
    }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_invitation_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ProjectInvitationController.prototype, "getProjectInvitations", null);
__decorate([
    (0, common_1.Post)('projects/:projectId/invitations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send project invitation',
        description: 'Send an invitation to join a project by email (optional)'
    }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Invitation sent successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input or user already invited'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_invitation_dto_1.SendProjectInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectInvitationController.prototype, "sendInvitation", null);
__decorate([
    (0, common_1.Post)('invitations/:token/accept'),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept project invitation',
        description: 'Accept a project invitation using the invitation token'
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation accepted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Invitation not found'
    }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectInvitationController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)('invitations/:token/decline'),
    (0, swagger_1.ApiOperation)({
        summary: 'Decline project invitation',
        description: 'Decline a project invitation using the invitation token'
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation declined successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Invitation not found'
    }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectInvitationController.prototype, "declineInvitation", null);
__decorate([
    (0, common_1.Get)('my-invitations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my invitations',
        description: 'Retrieve paginated list of invitations for the authenticated user'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'perPage', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful operation'
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_invitation_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectInvitationController.prototype, "getMyInvitations", null);
exports.ProjectInvitationController = ProjectInvitationController = __decorate([
    (0, swagger_1.ApiTags)('Project Invitations'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)('PROJECT_INVITATION_REPOSITORY')),
    __param(1, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
        prisma_user_repository_1.PrismaUserRepository,
        send_project_invitation_use_case_1.SendProjectInvitationUseCase,
        accept_project_invitation_use_case_1.AcceptProjectInvitationUseCase,
        decline_project_invitation_use_case_1.DeclineProjectInvitationUseCase])
], ProjectInvitationController);
//# sourceMappingURL=project-invitation.controller.js.map