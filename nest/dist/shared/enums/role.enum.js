"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.RoleLabels = exports.Role = void 0;
const permission_enum_1 = require("./permission.enum");
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["CLIENT"] = "client";
    Role["CHAT_MEMBER"] = "chat_member";
})(Role || (exports.Role = Role = {}));
exports.RoleLabels = {
    [Role.ADMIN]: 'Администратор',
    [Role.CLIENT]: 'Клиент',
    [Role.CHAT_MEMBER]: 'Участник чата',
};
exports.RolePermissions = {
    [Role.ADMIN]: Object.values(permission_enum_1.Permission),
    [Role.CLIENT]: [
        permission_enum_1.Permission.VIEW_OWN_PROJECTS,
        permission_enum_1.Permission.CREATE_PROJECTS,
        permission_enum_1.Permission.UPDATE_OWN_PROJECTS,
        permission_enum_1.Permission.VIEW_ASSIGNED_PROJECTS,
        permission_enum_1.Permission.DELETE_OWN_PROJECTS,
        permission_enum_1.Permission.MANAGE_PROJECT_TASKS,
        permission_enum_1.Permission.CREATE_TASKS,
        permission_enum_1.Permission.UPDATE_TASK_STATUS,
        permission_enum_1.Permission.VIEW_ASSIGNED_TASKS,
        permission_enum_1.Permission.VIEW_PROJECT_CHATS,
        permission_enum_1.Permission.CREATE_CHATS,
        permission_enum_1.Permission.UPDATE_CHATS,
        permission_enum_1.Permission.SEND_MESSAGES,
    ],
    [Role.CHAT_MEMBER]: [
        permission_enum_1.Permission.VIEW_PROJECT_CHATS,
        permission_enum_1.Permission.SEND_MESSAGES,
        permission_enum_1.Permission.VIEW_USER_PROFILES,
    ],
};
//# sourceMappingURL=role.enum.js.map