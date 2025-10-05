import { SendProjectInvitationUseCase } from '../../../application/use-cases/send-project-invitation.use-case';
import { AcceptProjectInvitationUseCase } from '../../../application/use-cases/accept-project-invitation.use-case';
import { DeclineProjectInvitationUseCase } from '../../../application/use-cases/decline-project-invitation.use-case';
import { PrismaProjectInvitationRepository } from '../../repositories/prisma-project-invitation.repository';
import { SendProjectInvitationDto, PaginationDto } from '../dto/project-invitation.dto';
import { PrismaUserRepository } from '../../repositories/prisma-user.repository';
import { AuthenticatedRequest } from "../../../shared";
export declare class ProjectInvitationController {
    private readonly invitationRepository;
    private readonly userRepository;
    private readonly sendInvitationUseCase;
    private readonly acceptInvitationUseCase;
    private readonly declineInvitationUseCase;
    constructor(invitationRepository: PrismaProjectInvitationRepository, userRepository: PrismaUserRepository, sendInvitationUseCase: SendProjectInvitationUseCase, acceptInvitationUseCase: AcceptProjectInvitationUseCase, declineInvitationUseCase: DeclineProjectInvitationUseCase);
    getProjectInvitations(projectId: string, paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            projectId: string;
            invitedBy: string;
            invitedEmail: string | null;
            token: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            permissions: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.InvitationStatus;
            expiresAt: Date;
            acceptedAt: Date | null;
            declinedAt: Date | null;
            acceptedBy: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        links: {
            accept: string;
            decline: string;
        };
        emailSent: boolean;
    }>;
    acceptInvitation(token: string, req: any): Promise<any>;
    declineInvitation(token: string): Promise<{
        message: string;
    }>;
    getMyInvitations(paginationDto: PaginationDto, req: any): Promise<{
        data: {
            id: string;
            projectId: string;
            invitedBy: string;
            invitedEmail: string | null;
            token: string;
            role: import(".prisma/client").$Enums.ProjectRole;
            permissions: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.InvitationStatus;
            expiresAt: Date;
            acceptedAt: Date | null;
            declinedAt: Date | null;
            acceptedBy: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
}
