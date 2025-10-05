import { Model } from 'mongoose';
import { ProjectInvitation, ProjectInvitationDocument, InvitationStatus } from '../database/schemas/project-invitation.schema';
export declare class MongoProjectInvitationRepository {
    private projectInvitationModel;
    constructor(projectInvitationModel: Model<ProjectInvitationDocument>);
    create(invitationData: Partial<ProjectInvitation>): Promise<ProjectInvitation>;
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
