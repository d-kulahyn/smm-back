import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectInvitationController } from '../api/controllers/project-invitation.controller';
import { SendProjectInvitationUseCase } from '../../application/use-cases/send-project-invitation.use-case';
import { AcceptProjectInvitationUseCase } from '../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../repositories/prisma-project-invitation.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../services/email.service';

export const PROJECT_INVITATION_REPOSITORY = 'PROJECT_INVITATION_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    ConfigModule, // Импортируем ConfigModule для доступа к переменным окружения
  ],
  controllers: [
    ProjectInvitationController
  ],
  providers: [
    // Use Cases
    SendProjectInvitationUseCase,
    AcceptProjectInvitationUseCase,
    DeclineProjectInvitationUseCase,

    // Services
    PrismaService,
    EmailService, // Добавляем EmailService

    // Repositories
    {
      provide: PROJECT_INVITATION_REPOSITORY,
      useClass: PrismaProjectInvitationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    PrismaProjectInvitationRepository,
    PrismaUserRepository,
  ],
  exports: [
    PROJECT_INVITATION_REPOSITORY,
    SendProjectInvitationUseCase,
    AcceptProjectInvitationUseCase,
    DeclineProjectInvitationUseCase,
    PrismaProjectInvitationRepository,
    EmailService,
  ],
})
export class ProjectInvitationModule {}
