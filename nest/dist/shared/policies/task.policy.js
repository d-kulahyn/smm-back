"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPolicy = void 0;
const common_1 = require("@nestjs/common");
const permission_enum_1 = require("../enums/permission.enum");
let TaskPolicy = class TaskPolicy {
    viewAny(user) {
        return user.hasAnyPermission([
            permission_enum_1.Permission.MANAGE_ALL_TASKS,
            permission_enum_1.Permission.MANAGE_PROJECT_TASKS,
            permission_enum_1.Permission.VIEW_ASSIGNED_TASKS,
        ]);
    }
    view(user, task) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if (task.creatorId === user.id) {
            return true;
        }
        if (task.assignedTo === user.id && user.hasPermission(permission_enum_1.Permission.VIEW_ASSIGNED_TASKS)) {
            return true;
        }
        return false;
    }
    create(user) {
        return user.hasAnyPermission([
            permission_enum_1.Permission.MANAGE_ALL_TASKS,
            permission_enum_1.Permission.MANAGE_PROJECT_TASKS,
            permission_enum_1.Permission.CREATE_TASKS,
        ]);
    }
    update(user, task) {
        if (task.status === 'completed') {
            return false;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if (task.creatorId === user.id) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_PROJECT_TASKS)) {
            return this.canUserAccessProjectTasks(user, task);
        }
        return false;
    }
    updateStatus(user, task) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if ((task.creatorId === user.id || task.assignedTo === user.id) &&
            user.hasPermission(permission_enum_1.Permission.UPDATE_TASK_STATUS)) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_PROJECT_TASKS)) {
            return this.canUserAccessProjectTasks(user, task);
        }
        return false;
    }
    delete(user, task) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if (task.creatorId === user.id && user.hasPermission(permission_enum_1.Permission.DELETE_TASKS)) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_PROJECT_TASKS)) {
            return this.canUserAccessProjectTasks(user, task);
        }
        return false;
    }
    assign(user, task) {
        if (task.status === 'completed') {
            return false;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if (task.creatorId === user.id) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_PROJECT_TASKS)) {
            return this.canUserAccessProjectTasks(user, task);
        }
        return false;
    }
    changePriority(user, task) {
        if (task.status === 'completed') {
            return false;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_TASKS)) {
            return true;
        }
        if (task.creatorId === user.id) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_PROJECT_TASKS)) {
            return this.canUserAccessProjectTasks(user, task);
        }
        return false;
    }
    createReminder(user, task) {
        if (task.status === 'completed') {
            return false;
        }
        if (task.creatorId === user.id || task.assignedTo === user.id) {
            return true;
        }
        return false;
    }
    canUserAccessProjectTasks(user, task) {
        if (task.project) {
            if (task.project.ownerId === user.id) {
                return true;
            }
            if (task.project.members) {
                const member = task.project.members.find((m) => m.userId === user.id);
                return member !== undefined;
            }
        }
        return false;
    }
};
exports.TaskPolicy = TaskPolicy;
exports.TaskPolicy = TaskPolicy = __decorate([
    (0, common_1.Injectable)()
], TaskPolicy);
//# sourceMappingURL=task.policy.js.map