"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const enums_1 = require("../enums");
class Task {
    constructor(id, title, projectId, creatorId, description, status = enums_1.TaskStatus.pending, priority = enums_1.TaskPriority.MEDIUM, assignedTo, completedAt, dueDate, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.title = title;
        this.projectId = projectId;
        this.creatorId = creatorId;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assignedTo = assignedTo;
        this.completedAt = completedAt;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    complete() {
        return new Task(this.id, this.title, this.projectId, this.creatorId, this.description, enums_1.TaskStatus.completed, this.priority, this.assignedTo, new Date(), this.dueDate, this.createdAt, new Date());
    }
    startProgress() {
        return new Task(this.id, this.title, this.projectId, this.creatorId, this.description, enums_1.TaskStatus.on_hold, this.priority, this.assignedTo, this.completedAt, this.dueDate, this.createdAt, new Date());
    }
    isCompleted() {
        return this.status === enums_1.TaskStatus.completed;
    }
    isOverdue() {
        return this.dueDate ? new Date() > this.dueDate && !this.isCompleted() : false;
    }
}
exports.Task = Task;
//# sourceMappingURL=task.entity.js.map