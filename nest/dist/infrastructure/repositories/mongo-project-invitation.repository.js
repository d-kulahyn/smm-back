"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoProjectInvitationRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_invitation_schema_1 = require("../database/schemas/project-invitation.schema");
let MongoProjectInvitationRepository = class MongoProjectInvitationRepository {
    constructor(projectInvitationModel) {
        this.projectInvitationModel = projectInvitationModel;
    }
    async create(invitationData) {
        const invitation = new this.projectInvitationModel(invitationData);
        return invitation.save();
    }
    async findByToken(token) {
        return this.projectInvitationModel.findOne({ token }).exec();
    }
    async findByProjectIdPaginated(projectId, page = 1, perPage = 15) {
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
    async findByUserEmailPaginated(email, page = 1, perPage = 15) {
        const skip = (page - 1) * perPage;
        const [data, total] = await Promise.all([
            this.projectInvitationModel
                .find({
                invitedEmail: email,
                status: project_invitation_schema_1.InvitationStatus.PENDING
            })
                .skip(skip)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .exec(),
            this.projectInvitationModel.countDocuments({
                invitedEmail: email,
                status: project_invitation_schema_1.InvitationStatus.PENDING
            })
        ]);
        return { data, total };
    }
    async findPendingInvitationByEmailAndProjectId(projectId, email) {
        return this.projectInvitationModel.findOne({
            projectId,
            invitedEmail: email,
            status: project_invitation_schema_1.InvitationStatus.PENDING
        }).exec();
    }
    async updateStatus(token, status, acceptedBy) {
        const updateData = { status };
        if (status === project_invitation_schema_1.InvitationStatus.ACCEPTED) {
            updateData.acceptedAt = new Date();
            if (acceptedBy) {
                updateData.acceptedBy = acceptedBy;
            }
        }
        else if (status === project_invitation_schema_1.InvitationStatus.DECLINED) {
            updateData.declinedAt = new Date();
        }
        return this.projectInvitationModel.findOneAndUpdate({ token }, updateData, { new: true }).exec();
    }
    async deleteExpiredInvitations() {
        const result = await this.projectInvitationModel.deleteMany({
            status: project_invitation_schema_1.InvitationStatus.PENDING,
            expiresAt: { $lt: new Date() }
        });
        return result.deletedCount;
    }
};
exports.MongoProjectInvitationRepository = MongoProjectInvitationRepository;
exports.MongoProjectInvitationRepository = MongoProjectInvitationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_invitation_schema_1.ProjectInvitation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoProjectInvitationRepository);
//# sourceMappingURL=mongo-project-invitation.repository.js.map