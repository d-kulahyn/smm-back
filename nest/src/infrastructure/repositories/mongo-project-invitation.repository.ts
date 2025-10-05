import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectInvitation, ProjectInvitationDocument, InvitationStatus } from '../database/schemas/project-invitation.schema';

@Injectable()
export class MongoProjectInvitationRepository {
  constructor(
    @InjectModel(ProjectInvitation.name)
    private projectInvitationModel: Model<ProjectInvitationDocument>
  ) {}

  async create(invitationData: Partial<ProjectInvitation>): Promise<ProjectInvitation> {
    const invitation = new this.projectInvitationModel(invitationData);
    return invitation.save();
  }

  async findByToken(token: string): Promise<ProjectInvitation | null> {
    return this.projectInvitationModel.findOne({ token }).exec();
  }

  async findByProjectIdPaginated(
    projectId: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<{ data: ProjectInvitation[], total: number }> {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.projectInvitationModel
        .find({ projectId })
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec(),
      this.projectInvitationModel.countDocuments({ projectId })
    ]);

    return { data, total };
  }

  async findByUserEmailPaginated(
    email: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<{ data: ProjectInvitation[], total: number }> {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.projectInvitationModel
        .find({
          invitedEmail: email,
          status: InvitationStatus.PENDING
        })
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec(),
      this.projectInvitationModel.countDocuments({
        invitedEmail: email,
        status: InvitationStatus.PENDING
      })
    ]);

    return { data, total };
  }

  async findPendingInvitationByEmailAndProjectId(
    projectId: string,
    email: string
  ): Promise<ProjectInvitation | null> {
    return this.projectInvitationModel.findOne({
      projectId,
      invitedEmail: email,
      status: InvitationStatus.PENDING
    }).exec();
  }

  async updateStatus(
    token: string,
    status: InvitationStatus,
    acceptedBy?: string
  ): Promise<ProjectInvitation | null> {
    const updateData: any = { status };

    if (status === InvitationStatus.ACCEPTED) {
      updateData.acceptedAt = new Date();
      if (acceptedBy) {
        updateData.acceptedBy = acceptedBy;
      }
    } else if (status === InvitationStatus.DECLINED) {
      updateData.declinedAt = new Date();
    }

    return this.projectInvitationModel.findOneAndUpdate(
      { token },
      updateData,
      { new: true }
    ).exec();
  }

  async deleteExpiredInvitations(): Promise<number> {
    const result = await this.projectInvitationModel.deleteMany({
      status: InvitationStatus.PENDING,
      expiresAt: { $lt: new Date() }
    });

    return result.deletedCount;
  }
}
