"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResource = void 0;
const date_formatter_1 = require("../../../shared/formatters/date.formatter");
const task_resource_dto_1 = require("./task-resource.dto");
const project_member_resource_dto_1 = require("./project-member-resource.dto");
const project_invitation_resource_dto_1 = require("./project-invitation-resource.dto");
const chat_resource_dto_1 = require("./chat-resource.dto");
class ProjectResource {
    constructor(project) {
        this.id = project.id;
        this.name = project.name;
        this.description = project.description;
        this.status = project.status;
        this.customer_id = project.ownerId;
        this.start_date = date_formatter_1.DateFormatter.formatDate(project.startDate);
        this.end_date = date_formatter_1.DateFormatter.formatDate(project.endDate);
        this.budget = project.budget;
        this.metadata = project.metadata;
        this.is_active = project.isActive();
        this.is_completed = project.isCompleted();
        this.stats = project.statsDto;
        this.avatar = project.avatar ? `/storage/${project.avatar}` : null;
        this.color = project.color;
        this.created_at = date_formatter_1.DateFormatter.formatCreatedAt(project.createdAt);
        this.updated_at = date_formatter_1.DateFormatter.formatUpdatedAt(project.updatedAt);
        this.tasks = project.tasks ? task_resource_dto_1.TaskResource.collection(project.tasks) : [];
        this.members = project.members ? project_member_resource_dto_1.ProjectMemberResource.collection(project.members) : [];
        this.invitations = project.invitations ? project_invitation_resource_dto_1.ProjectInvitationResource.collection(project.invitations) : [];
        this.chats = project.chats ? chat_resource_dto_1.ChatResource.collectionWithExtras(project.chats) : [];
    }
    static fromEntity(project) {
        return new ProjectResource(project);
    }
    static collection(projects) {
        return projects.map(project => new ProjectResource(project));
    }
}
exports.ProjectResource = ProjectResource;
//# sourceMappingURL=project-resource.dto.js.map