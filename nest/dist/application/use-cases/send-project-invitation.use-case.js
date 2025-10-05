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
exports.SendProjectInvitationUseCase = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_project_invitation_repository_1 = require("../../infrastructure/repositories/prisma-project-invitation.repository");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const email_service_1 = require("../../infrastructure/services/email.service");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
let SendProjectInvitationUseCase = class SendProjectInvitationUseCase {
    constructor(invitationRepository, prisma, emailService, configService) {
        this.invitationRepository = invitationRepository;
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
    }
    async execute(dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: dto.projectId }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${dto.projectId} not found`);
        }
        const hasAccess = project.ownerId === dto.invitedBy ||
            await this.prisma.projectMember.findFirst({
                where: {
                    projectId: dto.projectId,
                    userId: dto.invitedBy,
                    role: { in: ['owner', 'admin'] }
                }
            });
        if (!hasAccess) {
            throw new common_1.BadRequestException('You do not have permission to invite users to this project');
        }
        if (dto.invitedEmail) {
            const existingInvitation = await this.invitationRepository.findPendingInvitationByEmailAndProjectId(dto.projectId, dto.invitedEmail);
            if (existingInvitation) {
                throw new common_1.BadRequestException('An invitation has already been sent to this email');
            }
        }
        const token = this.generateInvitationToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invitationData = {
            projectId: dto.projectId,
            invitedBy: dto.invitedBy,
            invitedEmail: dto.invitedEmail,
            token,
            role: dto.role,
            permissions: dto.permissions || [],
            status: client_1.InvitationStatus.pending,
            expiresAt
        };
        const invitation = await this.invitationRepository.create(invitationData);
        const baseUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const acceptUrl = `${baseUrl}/invitations/${token}/accept`;
        const declineUrl = `${baseUrl}/invitations/${token}/decline`;
        if (dto.invitedEmail) {
            try {
                const [inviter, projectData] = await Promise.all([
                    this.prisma.user.findUnique({ where: { id: dto.invitedBy }, select: { name: true } }),
                    this.prisma.project.findUnique({ where: { id: dto.projectId }, select: { name: true } })
                ]);
                await this.emailService.sendProjectInvitationEmail({
                    email: dto.invitedEmail,
                    projectName: projectData?.name || 'Unknown Project',
                    inviterName: inviter?.name || 'Unknown User',
                    acceptUrl,
                    declineUrl,
                    role: dto.role
                });
            }
            catch (error) {
                console.error('Failed to send invitation email:', error);
            }
        }
        return {
            invitation,
            acceptUrl,
            declineUrl
        };
    }
    generateInvitationToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
};
exports.SendProjectInvitationUseCase = SendProjectInvitationUseCase;
exports.SendProjectInvitationUseCase = SendProjectInvitationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('PROJECT_INVITATION_REPOSITORY')),
    __metadata("design:paramtypes", [prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
        prisma_service_1.PrismaService,
        email_service_1.EmailService,
        config_1.ConfigService])
], SendProjectInvitationUseCase);
//# sourceMappingURL=send-project-invitation.use-case.js.map