import { AcceptProjectInvitationUseCase } from '../../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../../repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../database/prisma.service';
export declare class PublicProjectInvitationController {
    private readonly invitationRepository;
    private readonly prisma;
    private readonly acceptInvitationUseCase;
    private readonly declineInvitationUseCase;
    constructor(invitationRepository: PrismaProjectInvitationRepository, prisma: PrismaService, acceptInvitationUseCase: AcceptProjectInvitationUseCase, declineInvitationUseCase: DeclineProjectInvitationUseCase);
    getInvitationDetails(token: string): Promise<{
        error: string;
        statusCode: number;
        invitation?: undefined;
    } | {
        invitation: {
            token: string;
            projectName: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            inviterName: string;
            expiresAt: Date;
            invitedEmail: string;
        };
        error?: undefined;
        statusCode?: undefined;
    }>;
    acceptInvitationAuthenticated(token: string, req: any): Promise<any>;
    declineInvitation(token: string): Promise<{
        message: string;
    }>;
}
