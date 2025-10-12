import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ChatRepository, ChatWithExtras } from '../../domain/repositories/chat.repository';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { Chat } from '../../domain/entities/chat.entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { PaginatedResult } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: ChatRepository,
  ) {}

  async findById(id: string, userId: string): Promise<Project | null> {
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
            inviter: true,
            accepter: true
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

    if (!project) return null;

    const chats = await this.getProjectChats(id, userId);

    return this.toDomainWithRelations(project, chats);
  }

  async findByOwnerId(ownerId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { ownerId },
      include: {
        members: true,
        tasks: true,
      },
    });

    return projects.map(this.toDomain);
  }

  async findByMemberId(userId: string): Promise<Project[]> {
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

  async create(project: Project): Promise<Project> {
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

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
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

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }

  async findByUserIdPaginated(userId: string, page: number, perPage: number): Promise<PaginatedResult<Project>> {
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
    // Используем новый метод для получения чатов с unreadCount и lastMessage
    const chatsMap = await this.getProjectChatsMapWithExtras(projectIds, userId);

    const projectsWithRelations = projects.map(project => {
      const chats = chatsMap.get(project.id) || [];
      return this.toDomainWithRelationsWithExtras(project, chats);
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

  private async getProjectChats(projectId: string, userId: string): Promise<Chat[]> {
    return this.chatRepository.findByProjectId(projectId, userId);
  }

  private async getProjectChatsMap(projectIds: string[]): Promise<Map<string, Chat[]>> {
    return this.chatRepository.findByProjectIds(projectIds);
  }

  private async getProjectChatsMapWithExtras(projectIds: string[], userId: string): Promise<Map<string, ChatWithExtras[]>> {
    return this.chatRepository.findByProjectIdsWithExtras(projectIds, userId);
  }

  private toDomainWithRelations(project: any, chats: Chat[] = []): Project {
    const domainProject = new Project(
      project.id,
      project.name,
      project.ownerId,
      project.description,
      project.status as ProjectStatus,
      project.startDate,
      project.endDate,
      project.budget ? Number(project.budget) : undefined,
      project.avatar,
      project.color,
      project.metadata,
      project.createdAt,
      project.updatedAt,
    );

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

  private toDomainWithRelationsWithExtras(project: any, chats: ChatWithExtras[] = []): Project {
    const domainProject = new Project(
      project.id,
      project.name,
      project.ownerId,
      project.description,
      project.status as ProjectStatus,
      project.startDate,
      project.endDate,
      project.budget ? Number(project.budget) : undefined,
      project.avatar,
      project.color,
      project.metadata,
      project.createdAt,
      project.updatedAt,
    );

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

  private toDomain(project: any): Project {
    return new Project(
      project.id,
      project.name,
      project.ownerId,
      project.description,
      project.status as ProjectStatus,
      project.startDate,
      project.endDate,
      project.budget ? Number(project.budget) : undefined,
      project.avatar,
      project.color,
      project.metadata,
      project.createdAt,
      project.updatedAt,
    );
  }
}
