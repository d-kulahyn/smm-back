import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, ProjectInvitation, InvitationStatus, ProjectRole } from '@prisma/client';

export interface CreateProjectInvitationData {
  projectId: string;
  invitedBy: string;
  invitedEmail?: string;
  token: string;
  role: ProjectRole;
  permissions?: string[];
  status: InvitationStatus;
  expiresAt: Date;
}

@Injectable()
export class PrismaProjectInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProjectInvitationData): Promise<ProjectInvitation> {
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

  async findByToken(token: string): Promise<ProjectInvitation | null> {
    return this.prisma.projectInvitation.findUnique({
      where: { token },
      include: {
        project: true,
        inviter: true,
      },
    });
  }

  async findByProjectIdPaginated(
    projectId: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<{ data: ProjectInvitation[], total: number }> {
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

  async findByUserEmailPaginated(
    email: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<{ data: ProjectInvitation[], total: number }> {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.prisma.projectInvitation.findMany({
        where: {
          invitedEmail: email,
          status: InvitationStatus.pending,
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
          status: InvitationStatus.pending,
        },
      }),
    ]);

    return { data, total };
  }

  async findPendingInvitationByEmailAndProjectId(
    projectId: string,
    email: string
  ): Promise<ProjectInvitation | null> {
    return this.prisma.projectInvitation.findFirst({
      where: {
        projectId,
        invitedEmail: email,
        status: InvitationStatus.pending,
      },
    });
  }

  async updateStatus(
    token: string,
    status: InvitationStatus,
    acceptedBy?: string
  ): Promise<ProjectInvitation | null> {
    const updateData: Prisma.ProjectInvitationUpdateInput = {
      status,
    };

    if (status === InvitationStatus.accepted) {
      updateData.acceptedAt = new Date();
      if (acceptedBy) {
        updateData.accepter = {
          connect: { id: acceptedBy }
        };
      }
    } else if (status === InvitationStatus.declined) {
      updateData.declinedAt = new Date();
    }

    return this.prisma.projectInvitation.update({
      where: { token },
      data: updateData,
    });
  }

  async deleteExpiredInvitations(): Promise<number> {
    const result = await this.prisma.projectInvitation.deleteMany({
      where: {
        status: InvitationStatus.pending,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
