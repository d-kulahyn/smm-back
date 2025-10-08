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
exports.AcceptProjectInvitationUseCase = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const prisma_project_invitation_repository_1 = require("../../infrastructure/repositories/prisma-project-invitation.repository");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const client_1 = require("@prisma/client");
let AcceptProjectInvitationUseCase = class AcceptProjectInvitationUseCase {
    constructor(invitationRepository, prisma) {
        this.invitationRepository = invitationRepository;
        this.prisma = prisma;
    }
    async execute(dto) {
        const invitation = await this.invitationRepository.findByToken(dto.token);
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== client_1.InvitationStatus.pending) {
            throw new common_1.BadRequestException('Invitation is no longer valid');
        }
        if (invitation.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invitation has expired');
        }
        if (invitation.invitedBy === dto.userId) {
            throw new common_1.BadRequestException('You cannot accept an invitation you sent to yourself');
        }
        const existingMember = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: invitation.projectId,
                    userId: dto.userId
                }
            }
        });
        if (existingMember) {
            throw new common_1.BadRequestException('You are already a member of this project');
        }
        const result = await this.prisma.$transaction(async (prisma) => {
            const updatedInvitation = await prisma.projectInvitation.update({
                where: { token: dto.token },
                data: {
                    status: client_1.InvitationStatus.accepted,
                    acceptedAt: new Date(),
                    acceptedBy: dto.userId
                },
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                }
            });
            const newMember = await prisma.projectMember.create({
                data: {
                    projectId: invitation.projectId,
                    userId: dto.userId,
                    role: invitation.role,
                    permissions: invitation.permissions || {}
                },
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
            return {
                invitation: updatedInvitation,
                member: newMember
            };
        });
        return {
            message: 'Invitation accepted successfully and you have been added to the project',
            project: result.member.project,
            role: invitation.role,
            permissions: invitation.permissions,
            member: result.member
        };
    }
};
exports.AcceptProjectInvitationUseCase = AcceptProjectInvitationUseCase;
exports.AcceptProjectInvitationUseCase = AcceptProjectInvitationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('PROJECT_INVITATION_REPOSITORY')),
    __metadata("design:paramtypes", [prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
        prisma_service_1.PrismaService])
], AcceptProjectInvitationUseCase);
//# sourceMappingURL=accept-project-invitation.use-case.js.map