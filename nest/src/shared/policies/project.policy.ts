import { Injectable } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';
import { Project } from '../../domain/entities/project.entity';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  permissions: Permission[];
  hasPermission(permission: Permission): boolean;
  hasAnyPermission(permissions: Permission[]): boolean;
  hasAllPermissions(permissions: Permission[]): boolean;
  isAdmin(): boolean;
  isClient(): boolean;
}

@Injectable()
export class ProjectPolicy {
  /**
   * Determine whether the user can view any projects.
   */
  viewAny(user: AuthUser): boolean {
    return user.hasAnyPermission([
      Permission.MANAGE_ALL_PROJECTS,
      Permission.MANAGE_ASSIGNED_PROJECTS,
      Permission.VIEW_OWN_PROJECTS,
      Permission.VIEW_ASSIGNED_PROJECTS,
    ]);
  }

  /**
   * Determine whether the user can view the project.
   */
  view(user: AuthUser, project: Project): boolean {
    // Админ может видеть все проекты
    if (user.hasPermission(Permission.MANAGE_ALL_PROJECTS)) {
      return true;
    }

    // Владелец проекта может видеть свой проект
    if (project.ownerId === user.id && user.hasPermission(Permission.VIEW_OWN_PROJECTS)) {
      return true;
    }

    // Менеджер проекта может видеть назначенные проекты
    if (user.hasPermission(Permission.MANAGE_ASSIGNED_PROJECTS)) {
      // Здесь нужно проверить, назначен ли пользователь на этот проект
      return this.isUserAssignedToProject(user, project);
    }

    // Пользователь может видеть назначенные ему проекты
    if (user.hasPermission(Permission.VIEW_ASSIGNED_PROJECTS)) {
      return this.isUserAssignedToProject(user, project);
    }

    return false;
  }

  /**
   * Determine whether the user can create projects.
   */
  create(user: AuthUser): boolean {
    return user.hasAnyPermission([
      Permission.MANAGE_ALL_PROJECTS,
      Permission.CREATE_PROJECTS,
    ]);
  }

  /**
   * Determine whether the user can update the project.
   */
  update(user: AuthUser, project: Project): boolean {
    // Админ может обновлять все проекты
    if (user.hasPermission(Permission.MANAGE_ALL_PROJECTS)) {
      return true;
    }

    // Владелец проекта может обновлять свой проект
    if (project.ownerId === user.id && user.hasPermission(Permission.VIEW_OWN_PROJECTS)) {
      return true;
    }

    // Менеджер может обновлять назначенные проекты
    if (user.hasPermission(Permission.MANAGE_ASSIGNED_PROJECTS)) {
      return this.isUserAssignedToProject(user, project);
    }

    return false;
  }

  /**
   * Determine whether the user can delete the project.
   */
  delete(user: AuthUser, project: Project): boolean {
    // Только админ или владелец может удалять проекты
    return user.hasPermission(Permission.MANAGE_ALL_PROJECTS) ||
           (project.ownerId === user.id && user.hasPermission(Permission.DELETE_PROJECTS));
  }

  /**
   * Determine whether the user can manage project members.
   */
  manageMembers(user: AuthUser, project: Project): boolean {
    // Админ может управлять участниками всех проектов
    if (user.hasPermission(Permission.MANAGE_ALL_PROJECTS)) {
      return true;
    }

    // Владелец проекта может управлять участниками своего проекта
    if (project.ownerId === user.id) {
      return true;
    }

    // Проверяем, является ли пользователь участником проекта с правами управления
    return this.canUserManageProjectMembers(user, project);
  }

  /**
   * Check if user is assigned to the project
   */
  private isUserAssignedToProject(user: AuthUser, project: Project): boolean {
    // Здесь нужно проверить, является ли пользователь участником проекта
    // Можно сделать через members или через отдельный запрос к БД
    if (project.members) {
      return project.members.some(member => member.userId === user.id);
    }
    return false;
  }

  /**
   * Check if user can manage project members
   */
  private canUserManageProjectMembers(user: AuthUser, project: Project): boolean {
    if (project.members) {
      const member = project.members.find(m => m.userId === user.id);
      // Здесь нужно проверить роль участника в проекте
      // Предполагаем, что есть поле permissions в ProjectMember
      return member && member.permissions && member.permissions.includes('manage_members');
    }
    return false;
  }
}
