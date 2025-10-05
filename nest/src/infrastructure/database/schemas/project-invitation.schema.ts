import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired'
}

export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export type ProjectInvitationDocument = ProjectInvitation & Document;

@Schema({ timestamps: true })
export class ProjectInvitation {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  invitedBy: string;

  @Prop({ required: false })
  invitedEmail?: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, enum: ProjectRole })
  role: ProjectRole;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({
    required: true,
    enum: InvitationStatus,
    default: InvitationStatus.PENDING
  })
  status: InvitationStatus;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  acceptedAt?: Date;

  @Prop()
  declinedAt?: Date;

  @Prop()
  acceptedBy?: string; // ID пользователя, который принял приглашение
}

export const ProjectInvitationSchema = SchemaFactory.createForClass(ProjectInvitation);

// Добавим индексы для оптимизации запросов
ProjectInvitationSchema.index({ token: 1 }, { unique: true });
ProjectInvitationSchema.index({ projectId: 1 });
ProjectInvitationSchema.index({ invitedEmail: 1 });
ProjectInvitationSchema.index({ status: 1 });
ProjectInvitationSchema.index({ expiresAt: 1 });
