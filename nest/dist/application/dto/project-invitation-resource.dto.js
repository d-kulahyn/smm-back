"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInvitationResource = void 0;
const date_formatter_1 = require("../../shared/formatters/date.formatter");
class ProjectInvitationResource {
    constructor(invitation) {
        this.id = invitation.id;
        this.projectId = invitation.projectId;
        this.userId = invitation.userId;
        this.status = invitation.status;
        this.createdAt = date_formatter_1.DateFormatter.formatCreatedAt(invitation.createdAt);
        this.updatedAt = date_formatter_1.DateFormatter.formatUpdatedAt(invitation.updatedAt);
        if (invitation.user) {
            this.user = {
                id: invitation.user.id,
                name: invitation.user.name,
                email: invitation.user.email,
                avatar: invitation.user.avatar ? `/storage/${invitation.user.avatar}` : undefined,
            };
        }
    }
    static fromEntity(invitation) {
        return new ProjectInvitationResource(invitation);
    }
    static collection(invitations) {
        return invitations.map(invitation => new ProjectInvitationResource(invitation));
    }
}
exports.ProjectInvitationResource = ProjectInvitationResource;
//# sourceMappingURL=project-invitation-resource.dto.js.map