import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../infrastructure/services/email.service';
import { SendProjectInvitationUseCaseDto } from '../../infrastructure/api/dto/project-invitation.dto';
import { ProjectInvitation, InvitationStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class SendProjectInvitationUseCase {
  constructor(
    @Inject('PROJECT_INVITATION_REPOSITORY')
    private readonly invitationRepository: PrismaProjectInvitationRepository,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  async execute(dto: SendProjectInvitationUseCaseDto): Promise<{ invitation: ProjectInvitation; acceptUrl: string; declineUrl: string }> {
    // Проверяем существование проекта
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    // Проверяем права доступа - пользователь должен быть владельцем или администратором проекта
    const hasAccess = project.ownerId === dto.invitedBy ||
      await this.prisma.projectMember.findFirst({
        where: {
          projectId: dto.projectId,
          userId: dto.invitedBy,
          role: { in: ['owner', 'admin'] }
        }
      });

    if (!hasAccess) {
      throw new BadRequestException('You do not have permission to invite users to this project');
    }

    // Если email указан, проверяем, нет ли уже активного приглашения для этого email в проекте
    if (dto.invitedEmail) {
      const existingInvitation = await this.invitationRepository.findPendingInvitationByEmailAndProjectId(
        dto.projectId,
        dto.invitedEmail
      );

      if (existingInvitation) {
        throw new BadRequestException('An invitation has already been sent to this email');
      }
    }

    // Генерируем уникальный токен
    const token = this.generateInvitationToken();

    // Устанавливаем срок действия приглашения (7 дней)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitationData = {
      projectId: dto.projectId,
      invitedBy: dto.invitedBy,
      invitedEmail: dto.invitedEmail,
      token,
      role: dto.role,
      permissions: dto.permissions || [],
      status: InvitationStatus.pending,
      expiresAt
    };

    const invitation = await this.invitationRepository.create(invitationData);

    // Генерируем ссылки для принятия/отклонения приглашения
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const acceptUrl = `${baseUrl}/invitations/${token}/accept`;
    const declineUrl = `${baseUrl}/invitations/${token}/decline`;

    // Если указан email, отправляем приглашение по почте
    if (dto.invitedEmail) {
      try {
        // Получаем данные приглашающего и проекта для email
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
      } catch (error) {
        console.error('Failed to send invitation email:', error);
        // Не прерываем процесс если email не отправился
      }
    }

    return {
      invitation,
      acceptUrl,
      declineUrl
    };
  }

  private generateInvitationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
