"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const project_status_enum_1 = require("../enums/project-status.enum");
class Project {
    constructor(id, name, ownerId, description, status = project_status_enum_1.ProjectStatus.ACTIVE, startDate, endDate, budget, avatar, color, metadata, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.avatar = avatar;
        this.color = color;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.tasks = [];
        this.members = [];
        this.invitations = [];
        this.chats = [];
    }
    setStats(statsDto) {
        this.statsDto = statsDto;
        return this;
    }
    setTasks(tasks) {
        this.tasks = tasks;
        return this;
    }
    setMembers(members) {
        this.members = members;
        return this;
    }
    setInvitations(invitations) {
        this.invitations = invitations;
        return this;
    }
    setChats(chats) {
        this.chats = chats;
        return this;
    }
    complete() {
        return new Project(this.id, this.name, this.ownerId, this.description, project_status_enum_1.ProjectStatus.COMPLETED, this.startDate, this.endDate, this.budget, this.avatar, this.color, this.metadata, this.createdAt, new Date());
    }
    putOnHold() {
        return new Project(this.id, this.name, this.ownerId, this.description, project_status_enum_1.ProjectStatus.ON_HOLD, this.startDate, this.endDate, this.budget, this.avatar, this.color, this.metadata, this.createdAt, new Date());
    }
    cancel() {
        return new Project(this.id, this.name, this.ownerId, this.description, project_status_enum_1.ProjectStatus.CANCELLED, this.startDate, this.endDate, this.budget, this.avatar, this.color, this.metadata, this.createdAt, new Date());
    }
    archive() {
        return new Project(this.id, this.name, this.ownerId, this.description, project_status_enum_1.ProjectStatus.ARCHIVED, this.startDate, this.endDate, this.budget, this.avatar, this.color, this.metadata, this.createdAt, new Date());
    }
    isCompleted() {
        return this.status === project_status_enum_1.ProjectStatus.COMPLETED;
    }
    isActive() {
        return this.status === project_status_enum_1.ProjectStatus.ACTIVE;
    }
    isOnHold() {
        return this.status === project_status_enum_1.ProjectStatus.ON_HOLD;
    }
    isCancelled() {
        return this.status === project_status_enum_1.ProjectStatus.CANCELLED;
    }
    getBudgetFormatted() {
        return this.budget ? `$${this.budget.toFixed(2)}` : 'No budget set';
    }
    getDuration() {
        if (!this.startDate || !this.endDate)
            return null;
        return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
}
exports.Project = Project;
//# sourceMappingURL=project.entity.js.map