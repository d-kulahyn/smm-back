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
exports.PublicProjectInvitationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const accept_project_invitation_use_case_1 = require("../../../application/use-cases/accept-project-invitation.use-case");
const decline_project_invitation_use_case_1 = require("../../../application/use-cases/decline-project-invitation.use-case");
const prisma_project_invitation_repository_1 = require("../../repositories/prisma-project-invitation.repository");
const prisma_service_1 = require("../../database/prisma.service");
const project_invitation_dto_1 = require("../dto/project-invitation.dto");
const common_2 = require("@nestjs/common");
let PublicProjectInvitationController = class PublicProjectInvitationController {
    constructor(invitationRepository, prisma, acceptInvitationUseCase, declineInvitationUseCase) {
        this.invitationRepository = invitationRepository;
        this.prisma = prisma;
        this.acceptInvitationUseCase = acceptInvitationUseCase;
        this.declineInvitationUseCase = declineInvitationUseCase;
    }
    async getInvitationDetails(token) {
        const invitation = await this.invitationRepository.findByToken(token);
        if (!invitation) {
            return {
                error: 'Invitation not found',
                statusCode: 404
            };
        }
        if (invitation.expiresAt < new Date()) {
            return {
                error: 'Invitation has expired',
                statusCode: 410
            };
        }
        if (invitation.status !== 'pending') {
            return {
                error: 'Invitation is no longer valid',
                statusCode: 410
            };
        }
        const [project, inviter] = await Promise.all([
            this.prisma.project.findUnique({
                where: { id: invitation.projectId },
                select: { name: true }
            }),
            this.prisma.user.findUnique({
                where: { id: invitation.invitedBy },
                select: { name: true }
            })
        ]);
        return {
            invitation: {
                token: invitation.token,
                projectName: project?.name || 'Unknown Project',
                role: invitation.role,
                permissions: invitation.permissions,
                inviterName: inviter?.name || 'Unknown User',
                expiresAt: invitation.expiresAt,
                invitedEmail: invitation.invitedEmail
            }
        };
    }
    async acceptInvitationAuthenticated(token, req) {
        const acceptDto = new project_invitation_dto_1.AcceptProjectInvitationUseCaseDto();
        acceptDto.token = token;
        acceptDto.userId = req.user.id;
        return this.acceptInvitationUseCase.execute(acceptDto);
    }
    async declineInvitation(token) {
        return this.declineInvitationUseCase.execute(token);
    }
};
exports.PublicProjectInvitationController = PublicProjectInvitationController;
__decorate([
    (0, common_1.Get)(':token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get invitation details',
        description: 'Get invitation details by token for display on the frontend'
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation details retrieved successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Invitation not found'
    }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicProjectInvitationController.prototype, "getInvitationDetails", null);
__decorate([
    (0, common_1.Post)(':token/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept invitation (authenticated)',
        description: 'Accept a project invitation when user is authenticated'
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation accepted successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicProjectInvitationController.prototype, "acceptInvitationAuthenticated", null);
__decorate([
    (0, common_1.Post)(':token/decline'),
    (0, swagger_1.ApiOperation)({
        summary: 'Decline invitation (public)',
        description: 'Decline a project invitation without authentication'
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation declined successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicProjectInvitationController.prototype, "declineInvitation", null);
exports.PublicProjectInvitationController = PublicProjectInvitationController = __decorate([
    (0, swagger_1.ApiTags)('Public Project Invitations'),
    (0, common_1.Controller)('public/invitations'),
    __param(0, (0, common_2.Inject)('PROJECT_INVITATION_REPOSITORY')),
    __metadata("design:paramtypes", [prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
        prisma_service_1.PrismaService,
        accept_project_invitation_use_case_1.AcceptProjectInvitationUseCase,
        decline_project_invitation_use_case_1.DeclineProjectInvitationUseCase])
], PublicProjectInvitationController);
//# sourceMappingURL=public-project-invitation.controller.js.map