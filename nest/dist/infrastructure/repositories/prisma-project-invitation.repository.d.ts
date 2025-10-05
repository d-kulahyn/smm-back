import { PrismaService } from '../database/prisma.service';
import { ProjectInvitation, InvitationStatus, ProjectRole } from '@prisma/client';
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
export declare class PrismaProjectInvitationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProjectInvitationData): Promise<ProjectInvitation>;
    findByToken(token: string): Promise<ProjectInvitation | null>;
    findByProjectIdPaginated(projectId: string, page?: number, perPage?: number): Promise<{
        data: ProjectInvitation[];
        total: number;
    }>;
    findByUserEmailPaginated(email: string, page?: number, perPage?: number): Promise<{
        data: ProjectInvitation[];
        total: number;
    }>;
    findPendingInvitationByEmailAndProjectId(projectId: string, email: string): Promise<ProjectInvitation | null>;
    updateStatus(token: string, status: InvitationStatus, acceptedBy?: string): Promise<ProjectInvitation | null>;
    deleteExpiredInvitations(): Promise<number>;
}
