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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInvitationSchema = exports.ProjectInvitation = exports.ProjectRole = exports.InvitationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "pending";
    InvitationStatus["ACCEPTED"] = "accepted";
    InvitationStatus["DECLINED"] = "declined";
    InvitationStatus["EXPIRED"] = "expired";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["ADMIN"] = "admin";
    ProjectRole["MEMBER"] = "member";
    ProjectRole["VIEWER"] = "viewer";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
let ProjectInvitation = class ProjectInvitation {
};
exports.ProjectInvitation = ProjectInvitation;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "invitedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "invitedEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProjectRole }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ProjectInvitation.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: InvitationStatus,
        default: InvitationStatus.PENDING
    }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ProjectInvitation.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProjectInvitation.prototype, "acceptedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProjectInvitation.prototype, "declinedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "acceptedBy", void 0);
exports.ProjectInvitation = ProjectInvitation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProjectInvitation);
exports.ProjectInvitationSchema = mongoose_1.SchemaFactory.createForClass(ProjectInvitation);
exports.ProjectInvitationSchema.index({ token: 1 }, { unique: true });
exports.ProjectInvitationSchema.index({ projectId: 1 });
exports.ProjectInvitationSchema.index({ invitedEmail: 1 });
exports.ProjectInvitationSchema.index({ status: 1 });
exports.ProjectInvitationSchema.index({ expiresAt: 1 });
//# sourceMappingURL=project-invitation.schema.js.map