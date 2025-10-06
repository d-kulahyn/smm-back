import { Permission } from './permission.enum';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  CHAT_MEMBER = 'chat_member',
}

export const RoleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Администратор',
  [Role.CLIENT]: 'Клиент',
  [Role.CHAT_MEMBER]: 'Участник чата',
};

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.CLIENT]: [
    Permission.VIEW_OWN_PROJECTS,
    Permission.CREATE_PROJECTS,
    Permission.UPDATE_OWN_PROJECTS,
    Permission.VIEW_ASSIGNED_PROJECTS,
    Permission.DELETE_OWN_PROJECTS,
    Permission.MANAGE_PROJECT_TASKS,
    Permission.CREATE_TASKS,
    Permission.UPDATE_TASK_STATUS,
    Permission.VIEW_ASSIGNED_TASKS,
    // Chat permissions for CLIENT role
    Permission.VIEW_PROJECT_CHATS,
    Permission.CREATE_CHATS,
    Permission.UPDATE_CHATS,
    Permission.SEND_MESSAGES,
  ],
  [Role.CHAT_MEMBER]: [
    Permission.VIEW_PROJECT_CHATS,
    Permission.SEND_MESSAGES,
    Permission.VIEW_USER_PROFILES,
  ],
};
