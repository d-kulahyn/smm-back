import { SendProjectInvitationUseCase } from '../../../application/use-cases/send-project-invitation.use-case';
import { AcceptProjectInvitationUseCase } from '../../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../../repositories/prisma-project-invitation.repository';
import { PrismaUserRepository } from '../../repositories/prisma-user.repository';
import { AuthenticatedRequest } from "../../../shared";
import { SendProjectInvitationDto, PaginationDto } from '../requests';
export declare class ProjectInvitationController {
    private readonly invitationRepository;
    private readonly userRepository;
    private readonly sendInvitationUseCase;
    private readonly acceptInvitationUseCase;
    private readonly declineInvitationUseCase;
    constructor(invitationRepository: PrismaProjectInvitationRepository, userRepository: PrismaUserRepository, sendInvitationUseCase: SendProjectInvitationUseCase, acceptInvitationUseCase: AcceptProjectInvitationUseCase, declineInvitationUseCase: DeclineProjectInvitationUseCase);
    getProjectInvitations(projectId: string, paginationDto: PaginationDto): Promise<{
        data: {
            status: import(".prisma/client").$Enums.InvitationStatus;
            role: import(".prisma/client").$Enums.ProjectRole;
            id: string;
            projectId: string;
            createdAt: Date;
            updatedAt: Date;
            invitedBy: string;
            invitedEmail: string | null;
            token: string;
            permissions: import("@prisma/client/runtime/library").JsonValue | null;
            expiresAt: Date;
            acceptedAt: Date | null;
            declinedAt: Date | null;
            acceptedBy: string | null;
        }[];
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
    sendInvitation(projectId: string, dto: SendProjectInvitationDto, req: AuthenticatedRequest): Promise<{
        message: string;
        invitation: {
            id: string;
            token: string;
            projectId: string;
            invitedEmail: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            expiresAt: Date;
        };
        emailSent: boolean;
    }>;
    acceptInvitation(token: string, req: AuthenticatedRequest): Promise<any>;
    declineInvitation(token: string): Promise<{
        message: string;
    }>;
    getMyInvitations(paginationDto: PaginationDto, req: any): Promise<{
        data: {
            status: import(".prisma/client").$Enums.InvitationStatus;
            role: import(".prisma/client").$Enums.ProjectRole;
            id: string;
            projectId: string;
            createdAt: Date;
            updatedAt: Date;
            invitedBy: string;
            invitedEmail: string | null;
            token: string;
            permissions: import("@prisma/client/runtime/library").JsonValue | null;
            expiresAt: Date;
            acceptedAt: Date | null;
            declinedAt: Date | null;
            acceptedBy: string | null;
        }[];
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
}
