"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPolicy = void 0;
const common_1 = require("@nestjs/common");
const permission_enum_1 = require("../enums/permission.enum");
let ProjectPolicy = class ProjectPolicy {
    viewAny(user) {
        return user.hasAnyPermission([
            permission_enum_1.Permission.MANAGE_ALL_PROJECTS,
            permission_enum_1.Permission.MANAGE_ASSIGNED_PROJECTS,
            permission_enum_1.Permission.VIEW_OWN_PROJECTS,
            permission_enum_1.Permission.VIEW_ASSIGNED_PROJECTS,
        ]);
    }
    view(user, project) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_PROJECTS)) {
            return true;
        }
        if (project.ownerId === user.id && user.hasPermission(permission_enum_1.Permission.VIEW_OWN_PROJECTS)) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ASSIGNED_PROJECTS)) {
            return this.isUserAssignedToProject(user, project);
        }
        if (user.hasPermission(permission_enum_1.Permission.VIEW_ASSIGNED_PROJECTS)) {
            return this.isUserAssignedToProject(user, project);
        }
        return false;
    }
    create(user) {
        return user.hasAnyPermission([
            permission_enum_1.Permission.MANAGE_ALL_PROJECTS,
            permission_enum_1.Permission.CREATE_PROJECTS,
        ]);
    }
    update(user, project) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_PROJECTS)) {
            return true;
        }
        if (project.ownerId === user.id && user.hasPermission(permission_enum_1.Permission.VIEW_OWN_PROJECTS)) {
            return true;
        }
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ASSIGNED_PROJECTS)) {
            return this.isUserAssignedToProject(user, project);
        }
        return false;
    }
    delete(user, project) {
        return user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_PROJECTS) ||
            (project.ownerId === user.id && user.hasPermission(permission_enum_1.Permission.DELETE_PROJECTS));
    }
    manageMembers(user, project) {
        if (user.hasPermission(permission_enum_1.Permission.MANAGE_ALL_PROJECTS)) {
            return true;
        }
        if (project.ownerId === user.id) {
            return true;
        }
        return this.canUserManageProjectMembers(user, project);
    }
    isUserAssignedToProject(user, project) {
        if (project.members) {
            return project.members.some(member => member.userId === user.id);
        }
        return false;
    }
    canUserManageProjectMembers(user, project) {
        if (project.members) {
            const member = project.members.find(m => m.userId === user.id);
            return member && member.permissions && member.permissions.includes('manage_members');
        }
        return false;
    }
};
exports.ProjectPolicy = ProjectPolicy;
exports.ProjectPolicy = ProjectPolicy = __decorate([
    (0, common_1.Injectable)()
], ProjectPolicy);
//# sourceMappingURL=project.policy.js.map