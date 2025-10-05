import { Document } from 'mongoose';
export declare enum InvitationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    EXPIRED = "expired"
}
export declare enum ProjectRole {
    ADMIN = "admin",
    MEMBER = "member",
    VIEWER = "viewer"
}
export type ProjectInvitationDocument = ProjectInvitation & Document;
export declare class ProjectInvitation {
    projectId: string;
    invitedBy: string;
    invitedEmail?: string;
    token: string;
    role: ProjectRole;
    permissions: string[];
    status: InvitationStatus;
    expiresAt: Date;
    acceptedAt?: Date;
    declinedAt?: Date;
    acceptedBy?: string;
}
export declare const ProjectInvitationSchema: import("mongoose").Schema<ProjectInvitation, import("mongoose").Model<ProjectInvitation, any, any, any, Document<unknown, any, ProjectInvitation> & ProjectInvitation & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProjectInvitation, Document<unknown, {}, import("mongoose").FlatRecord<ProjectInvitation>> & import("mongoose").FlatRecord<ProjectInvitation> & {
    _id: import("mongoose").Types.ObjectId;
}>;
