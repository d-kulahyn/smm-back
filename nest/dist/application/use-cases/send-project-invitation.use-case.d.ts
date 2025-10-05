import { ConfigService } from '@nestjs/config';
import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../infrastructure/services/email.service';
import { SendProjectInvitationUseCaseDto } from '../../infrastructure/api/dto/project-invitation.dto';
import { ProjectInvitation } from '@prisma/client';
export declare class SendProjectInvitationUseCase {
    private readonly invitationRepository;
    private readonly prisma;
    private readonly emailService;
    private readonly configService;
    constructor(invitationRepository: PrismaProjectInvitationRepository, prisma: PrismaService, emailService: EmailService, configService: ConfigService);
    execute(dto: SendProjectInvitationUseCaseDto): Promise<{
        invitation: ProjectInvitation;
        acceptUrl: string;
        declineUrl: string;
    }>;
    private generateInvitationToken;
}
