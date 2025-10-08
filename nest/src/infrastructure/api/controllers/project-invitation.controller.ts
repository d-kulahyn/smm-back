import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Inject
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { SendProjectInvitationUseCase } from '../../../application/use-cases/send-project-invitation.use-case';
import { AcceptProjectInvitationUseCase } from '../../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../../repositories/prisma-project-invitation.repository';
import { PrismaUserRepository } from '../../repositories/prisma-user.repository';
import { AuthenticatedRequest } from "../../../shared";

// Request DTOs
import {
  SendProjectInvitationDto,
  PaginationDto
} from '../requests';

// Response DTOs
import {
  ProjectInvitationResponseDto,
  SendInvitationResponseDto,
  InvitationListResponseDto,
  ErrorResponseDto
} from '../responses';

// Use Case DTOs - временно оставляем здесь, так как они используются только в бизнес-логике
class SendProjectInvitationUseCaseDto {
  projectId: string;
  invitedBy: string;
  invitedEmail?: string;
  role: any;
  permissions?: string[];
}

class AcceptProjectInvitationUseCaseDto {
  token: string;
  userId: string;
}

@ApiTags('Project Invitations')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectInvitationController {
  constructor(
    @Inject('PROJECT_INVITATION_REPOSITORY')
    private readonly invitationRepository: PrismaProjectInvitationRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: PrismaUserRepository,
    private readonly sendInvitationUseCase: SendProjectInvitationUseCase,
    private readonly acceptInvitationUseCase: AcceptProjectInvitationUseCase,
    private readonly declineInvitationUseCase: DeclineProjectInvitationUseCase
  ) {}

  @Get('projects/:projectId/invitations')
  @ApiOperation({
    summary: 'Get project invitations',
    description: 'Retrieve paginated list of invitations for a specific project'
  })
  @ApiParam({ name: 'projectId', description: 'Project ID', type: 'string' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'perPage', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation'
  })
  async getProjectInvitations(
    @Param('projectId') projectId: string,
    @Query() paginationDto: PaginationDto
  ) {
    // Преобразуем строки в числа для корректной работы с Prisma
    const page = parseInt(paginationDto.page?.toString() || '1', 10);
    const perPage = parseInt(paginationDto.perPage?.toString() || '15', 10);

    const result = await this.invitationRepository.findByProjectIdPaginated(
      projectId,
      page,
      perPage
    );

    const totalPages = Math.ceil(result.total / perPage);

    return {
      data: result.data,
      pagination: {
        page,
        perPage,
        total: result.total,
        totalPages
      }
    };
  }

  @Post('projects/:projectId/invitations')
  @ApiOperation({
    summary: 'Send project invitation',
    description: 'Send an invitation to join a project by email (optional)'
  })
  @ApiParam({ name: 'projectId', description: 'Project ID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already invited'
  })
  @HttpCode(HttpStatus.CREATED)
  async sendInvitation(
    @Param('projectId') projectId: string,
    @Body() dto: SendProjectInvitationDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const invitationDto = new SendProjectInvitationUseCaseDto();
    invitationDto.projectId = projectId;
    invitationDto.invitedBy = req.user.userId;
    invitationDto.invitedEmail = dto.email;
    invitationDto.role = dto.role;
    invitationDto.permissions = dto.permissions;

    const result = await this.sendInvitationUseCase.execute(invitationDto);

    return {
      message: 'Invitation sent successfully',
      invitation: {
        id: result.invitation.id,
        token: result.invitation.token,
        projectId: result.invitation.projectId,
        invitedEmail: result.invitation.invitedEmail,
        role: result.invitation.role,
        permissions: result.invitation.permissions,
        expiresAt: result.invitation.expiresAt
      },
      emailSent: !!dto.email // Показываем, было ли отправлено письмо
    };
  }

  @Post('invitations/:token/accept')
  @ApiOperation({
    summary: 'Accept project invitation',
    description: 'Accept a project invitation using the invitation token'
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Invitation not found'
  })
  async acceptInvitation(
    @Param('token') token: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const acceptDto = new AcceptProjectInvitationUseCaseDto();
    acceptDto.token = token;
    acceptDto.userId = req.user.userId; // Исправляем на req.user.userId

    return this.acceptInvitationUseCase.execute(acceptDto);
  }

  @Post('invitations/:token/decline')
  @ApiOperation({
    summary: 'Decline project invitation',
    description: 'Decline a project invitation using the invitation token'
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Invitation declined successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Invitation not found'
  })
  async declineInvitation(
    @Param('token') token: string
  ) {
    return this.declineInvitationUseCase.execute(token);
  }

  @Get('my-invitations')
  @ApiOperation({
    summary: 'Get my invitations',
    description: 'Retrieve paginated list of invitations for the authenticated user'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'perPage', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation'
  })
  async getMyInvitations(
    @Query() paginationDto: PaginationDto,
    @Request() req: any
  ) {
    // Преобразуем строки в числа для корректной работы с Prisma
    const page = parseInt(paginationDto.page?.toString() || '1', 10);
    const perPage = parseInt(paginationDto.perPage?.toString() || '15', 10);

    const result = await this.invitationRepository.findByUserEmailPaginated(
      req.user.email, // Используем email текущего пользователя
      page,
      perPage
    );

    const totalPages = Math.ceil(result.total / perPage);

    return {
      data: result.data,
      pagination: {
        page,
        perPage,
        total: result.total,
        totalPages
      }
    };
  }
}
