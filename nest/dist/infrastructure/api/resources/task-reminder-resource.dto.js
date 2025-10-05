"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskReminderResource = void 0;
const date_formatter_1 = require("../../../shared/formatters/date.formatter");
class TaskReminderResource {
    constructor(reminder) {
        this.id = reminder.id;
        this.task_id = reminder.taskId;
        this.remind_at = date_formatter_1.DateFormatter.formatDateWithRelative(reminder.remindAt);
        this.message = reminder.message;
        this.is_sent = reminder.isSent || false;
        this.sent_at = reminder.sentAt ? date_formatter_1.DateFormatter.formatDateWithRelative(reminder.sentAt) : null;
        this.created_at = date_formatter_1.DateFormatter.formatCreatedAt(reminder.createdAt);
    }
    static fromEntity(reminder) {
        return new TaskReminderResource(reminder);
    }
    static collection(reminders) {
        return reminders.map(reminder => new TaskReminderResource(reminder));
    }
}
exports.TaskReminderResource = TaskReminderResource;
//# sourceMappingURL=task-reminder-resource.dto.js.map