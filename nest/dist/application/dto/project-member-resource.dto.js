"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMemberResource = void 0;
const date_formatter_1 = require("../../shared/formatters/date.formatter");
class ProjectMemberResource {
    constructor(member) {
        this.id = member.id;
        this.projectId = member.projectId;
        this.userId = member.userId;
        this.role = member.role;
        this.permissions = member.permissions;
        this.joinedAt = date_formatter_1.DateFormatter.formatCreatedAt(member.joinedAt);
        if (member.user) {
            this.user = {
                id: member.user.id,
                name: member.user.name,
                email: member.user.email,
                avatar: member.user.avatar ? `/storage/${member.user.avatar}` : undefined,
            };
        }
    }
    static fromEntity(member) {
        return new ProjectMemberResource(member);
    }
    static collection(members) {
        return members.map(member => new ProjectMemberResource(member));
    }
}
exports.ProjectMemberResource = ProjectMemberResource;
//# sourceMappingURL=project-member-resource.dto.js.map