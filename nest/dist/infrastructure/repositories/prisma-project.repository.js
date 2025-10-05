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
exports.PrismaProjectRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const chat_service_1 = require("../services/chat.service");
const project_entity_1 = require("../../domain/entities/project.entity");
let PrismaProjectRepository = class PrismaProjectRepository {
    constructor(prisma, chatService) {
        this.prisma = prisma;
        this.chatService = chatService;
    }
    async findById(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        dueDate: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                invitations: {
                    include: {
                        inviter: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        },
                        accepter: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    }
                }
            },
        });
        if (!project)
            return null;
        const chats = await this.getProjectChats(id);
        return this.toDomainWithRelations(project, chats);
    }
    async findByOwnerId(ownerId) {
        const projects = await this.prisma.project.findMany({
            where: { ownerId },
            include: {
                members: true,
                tasks: true,
            },
        });
        return projects.map(this.toDomain);
    }
    async findByMemberId(userId) {
        const projects = await this.prisma.project.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                members: true,
                tasks: true,
            },
        });
        return projects.map(this.toDomain);
    }
    async create(project) {
        console.log(project.ownerId);
        const created = await this.prisma.project.create({
            data: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                ownerId: project.ownerId,
                startDate: project.startDate,
                endDate: project.endDate,
                budget: project.budget,
                avatar: project.avatar,
                color: project.color,
                metadata: project.metadata,
            },
        });
        return this.toDomain(created);
    }
    async update(id, projectData) {
        const updated = await this.prisma.project.update({
            where: { id },
            data: {
                name: projectData.name,
                description: projectData.description,
                status: projectData.status,
                startDate: projectData.startDate,
                endDate: projectData.endDate,
                budget: projectData.budget,
                avatar: projectData.avatar,
                color: projectData.color,
                metadata: projectData.metadata,
            },
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.project.delete({
            where: { id },
        });
    }
    async findByUserIdPaginated(userId, page, perPage) {
        const skip = (page - 1) * perPage;
        const total = await this.prisma.project.count({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: { userId: userId },
                        },
                    },
                ],
            },
        });
        const projects = await this.prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: { userId: userId },
                        },
                    },
                ],
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        dueDate: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                invitations: {
                    include: {
                        inviter: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        },
                        accepter: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: perPage,
        });
        const totalPages = Math.ceil(total / perPage);
        const projectIds = projects.map(p => p.id);
        const chatsMap = await this.getProjectChatsMap(projectIds);
        const projectsWithRelations = projects.map(project => {
            const chats = chatsMap.get(project.id) || [];
            return this.toDomainWithRelations(project, chats);
        });
        return {
            data: projectsWithRelations,
            meta: {
                total,
                page,
                perPage,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async getProjectChats(projectId) {
        return this.chatService.findByProjectId(projectId);
    }
    async getProjectChatsMap(projectIds) {
        return this.chatService.findByProjectIds(projectIds);
    }
    toDomainWithRelations(project, chats = []) {
        const domainProject = new project_entity_1.Project(project.id, project.name, project.ownerId, project.description, project.status, project.startDate, project.endDate, project.budget ? Number(project.budget) : undefined, project.avatar, project.color, project.metadata, project.createdAt, project.updatedAt);
        if (project.tasks) {
            domainProject.setTasks(project.tasks);
        }
        if (project.members) {
            domainProject.setMembers(project.members);
        }
        if (project.invitations) {
            domainProject.setInvitations(project.invitations);
        }
        if (chats) {
            domainProject.setChats(chats);
        }
        return domainProject;
    }
    toDomain(project) {
        return new project_entity_1.Project(project.id, project.name, project.ownerId, project.description, project.status, project.startDate, project.endDate, project.budget ? Number(project.budget) : undefined, project.avatar, project.color, project.metadata, project.createdAt, project.updatedAt);
    }
};
exports.PrismaProjectRepository = PrismaProjectRepository;
exports.PrismaProjectRepository = PrismaProjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_service_1.ChatService])
], PrismaProjectRepository);
//# sourceMappingURL=prisma-project.repository.js.map