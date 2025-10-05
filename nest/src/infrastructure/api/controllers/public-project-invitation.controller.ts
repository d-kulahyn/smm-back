import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Render
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { AcceptProjectInvitationUseCase } from '../../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../../repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../database/prisma.service';
import { AcceptProjectInvitationUseCaseDto } from '../dto/project-invitation.dto';
import { Inject } from '@nestjs/common';

@ApiTags('Public Project Invitations')
@Controller('public/invitations')
export class PublicProjectInvitationController {
  constructor(
    @Inject('PROJECT_INVITATION_REPOSITORY')
    private readonly invitationRepository: PrismaProjectInvitationRepository,
    private readonly prisma: PrismaService,
    private readonly acceptInvitationUseCase: AcceptProjectInvitationUseCase,
    private readonly declineInvitationUseCase: DeclineProjectInvitationUseCase
  ) {}

  @Get(':token')
  @ApiOperation({
    summary: 'Get invitation details',
    description: 'Get invitation details by token for display on the frontend'
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Invitation details retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Invitation not found'
  })
  async getInvitationDetails(@Param('token') token: string) {
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

    // Получаем связанные данные отдельными запросами
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

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Accept invitation (authenticated)',
    description: 'Accept a project invitation when user is authenticated'
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully'
  })
  @HttpCode(HttpStatus.OK)
  async acceptInvitationAuthenticated(
    @Param('token') token: string,
    @Request() req: any
  ) {
    const acceptDto = new AcceptProjectInvitationUseCaseDto();
    acceptDto.token = token;
    acceptDto.userId = req.user.userId; // Исправляем на req.user.userId

    return this.acceptInvitationUseCase.execute(acceptDto);
  }

  @Post(':token/decline')
  @ApiOperation({
    summary: 'Decline invitation (public)',
    description: 'Decline a project invitation without authentication'
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Invitation declined successfully'
  })
  @HttpCode(HttpStatus.OK)
  async declineInvitation(@Param('token') token: string) {
    return this.declineInvitationUseCase.execute(token);
  }
}
