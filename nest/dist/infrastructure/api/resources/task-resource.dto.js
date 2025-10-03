"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResource = void 0;
const date_formatter_1 = require("../../../shared/formatters/date.formatter");
const task_reminder_resource_dto_1 = require("./task-reminder-resource.dto");
const task_attachment_resource_dto_1 = require("./task-attachment-resource.dto");
class TaskResource {
    constructor(task) {
        this.id = task.id;
        this.title = task.title;
        this.description = task.description;
        this.status = task.status;
        this.priority = task.priority;
        this.project_id = task.projectId;
        this.customer_id = task.customerId;
        this.assigned_to = task.assignedTo;
        this.due_date = date_formatter_1.DateFormatter.formatDate(task.dueDate);
        this.completed_at = date_formatter_1.DateFormatter.formatDate(task.completedAt);
        this.notes = task.notes;
        this.is_completed = task.isCompleted || this.status === 'on_hold';
        this.is_overdue = task.isOverdue || (task.dueDate && new Date(task.dueDate) < new Date() && !this.is_completed);
        this.metadata = task.metadata;
        this.created_at = date_formatter_1.DateFormatter.formatCreatedAt(task.createdAt);
        this.updated_at = date_formatter_1.DateFormatter.formatUpdatedAt(task.updatedAt);
        if (task.project) {
            this.project = {
                id: task.project.id,
                name: task.project.name,
                status: task.project.status,
            };
        }
        if (task.assignee) {
            this.assignee = {
                id: task.assignee.id,
                name: task.assignee.name,
                email: task.assignee.email,
                avatar: task.assignee.avatar ? `/storage/${task.assignee.avatar}` : null,
            };
        }
        if (task.creator) {
            this.creator = {
                id: task.creator.id,
                name: task.creator.name,
                email: task.creator.email,
                avatar: task.creator.avatar ? `/storage/${task.creator.avatar}` : null,
            };
        }
        this.reminders = task.reminders ? task_reminder_resource_dto_1.TaskReminderResource.collection(task.reminders) : [];
        this.attachments = task.attachments ? task_attachment_resource_dto_1.TaskAttachmentResource.collection(task.attachments) : [];
    }
    static fromEntity(task) {
        return new TaskResource(task);
    }
    static collection(tasks) {
        return tasks.map(task => new TaskResource(task));
    }
}
exports.TaskResource = TaskResource;
//# sourceMappingURL=task-resource.dto.js.map