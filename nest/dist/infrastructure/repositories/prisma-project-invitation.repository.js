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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProjectInvitationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let PrismaProjectInvitationRepository = class PrismaProjectInvitationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.projectInvitation.create({
            data: {
                projectId: data.projectId,
                invitedBy: data.invitedBy,
                invitedEmail: data.invitedEmail,
                token: data.token,
                role: data.role,
                permissions: data.permissions || [],
                status: data.status,
                expiresAt: data.expiresAt,
            },
        });
    }
    async findByToken(token) {
        return this.prisma.projectInvitation.findUnique({
            where: { token },
            include: {
                project: true,
                inviter: true,
            },
        });
    }
    async findByProjectIdPaginated(projectId, page = 1, perPage = 15) {
        const skip = (page - 1) * perPage;
        const [data, total] = await Promise.all([
            this.prisma.projectInvitation.findMany({
                where: { projectId },
                skip,
                take: perPage,
                orderBy: { createdAt: 'desc' },
                include: {
                    inviter: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    accepter: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.projectInvitation.count({
                where: { projectId },
            }),
        ]);
        return { data, total };
    }
    async findByUserEmailPaginated(email, page = 1, perPage = 15) {
        const skip = (page - 1) * perPage;
        const [data, total] = await Promise.all([
            this.prisma.projectInvitation.findMany({
                where: {
                    invitedEmail: email,
                    status: client_1.InvitationStatus.pending,
                },
                skip,
                take: perPage,
                orderBy: { createdAt: 'desc' },
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                    inviter: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.projectInvitation.count({
                where: {
                    invitedEmail: email,
                    status: client_1.InvitationStatus.pending,
                },
            }),
        ]);
        return { data, total };
    }
    async findPendingInvitationByEmailAndProjectId(projectId, email) {
        return this.prisma.projectInvitation.findFirst({
            where: {
                projectId,
                invitedEmail: email,
                status: client_1.InvitationStatus.pending,
            },
        });
    }
    async updateStatus(token, status, acceptedBy) {
        const updateData = {
            status,
        };
        if (status === client_1.InvitationStatus.accepted) {
            updateData.acceptedAt = new Date();
            if (acceptedBy) {
                updateData.accepter = {
                    connect: { id: acceptedBy }
                };
            }
        }
        else if (status === client_1.InvitationStatus.declined) {
            updateData.declinedAt = new Date();
        }
        return this.prisma.projectInvitation.update({
            where: { token },
            data: updateData,
        });
    }
    async deleteExpiredInvitations() {
        const result = await this.prisma.projectInvitation.deleteMany({
            where: {
                status: client_1.InvitationStatus.pending,
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }
};
exports.PrismaProjectInvitationRepository = PrismaProjectInvitationRepository;
exports.PrismaProjectInvitationRepository = PrismaProjectInvitationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProjectInvitationRepository);
//# sourceMappingURL=prisma-project-invitation.repository.js.map