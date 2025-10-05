import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AcceptProjectInvitationUseCaseDto } from '../../infrastructure/api/dto/project-invitation.dto';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class AcceptProjectInvitationUseCase {
  constructor(
    @Inject('PROJECT_INVITATION_REPOSITORY')
    private readonly invitationRepository: PrismaProjectInvitationRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(dto: AcceptProjectInvitationUseCaseDto): Promise<any> {
    const invitation = await this.invitationRepository.findByToken(dto.token);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.pending) {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    if (invitation.invitedBy === dto.userId) {
        throw new BadRequestException('You cannot accept an invitation you sent to yourself');
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
      throw new BadRequestException('You are already a member of this project');
    }


    const result = await this.prisma.$transaction(async (prisma) => {

      const updatedInvitation = await prisma.projectInvitation.update({
        where: { token: dto.token },
        data: {
          status: InvitationStatus.accepted,
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
}
