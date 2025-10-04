import { Injectable } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';
import { AuthUser } from './project.policy';

export interface TaskEntity {
  id: string;
  title: string;
  projectId: string;
  creatorId: string;
  assignedTo?: string;
  status: string;
  project?: any;
}

@Injectable()
export class TaskPolicy {
  /**
   * Determine whether the user can view any tasks.
   */
  viewAny(user: AuthUser): boolean {
    return user.hasAnyPermission([
      Permission.MANAGE_ALL_TASKS,
      Permission.MANAGE_PROJECT_TASKS,
      Permission.VIEW_ASSIGNED_TASKS,
    ]);
  }

  /**
   * Determine whether the user can view the task.
   */
  view(user: AuthUser, task: TaskEntity): boolean {
    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if (task.creatorId === user.id) {
      return true;
    }

    if (task.assignedTo === user.id && user.hasPermission(Permission.VIEW_ASSIGNED_TASKS)) {
      return true;
    }

    return false;
  }

  /**
   * Determine whether the user can create tasks.
   */
  create(user: AuthUser): boolean {
    return user.hasAnyPermission([
      Permission.MANAGE_ALL_TASKS,
      Permission.MANAGE_PROJECT_TASKS,
      Permission.CREATE_TASKS,
    ]);
  }

  /**
   * Determine whether the user can update the task.
   */
  update(user: AuthUser, task: TaskEntity): boolean {
    if (task.status === 'completed') {
      return false;
    }

    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if (task.creatorId === user.id) {
      return true;
    }

    if (user.hasPermission(Permission.MANAGE_PROJECT_TASKS)) {
      return this.canUserAccessProjectTasks(user, task);
    }

    return false;
  }

  /**
   * Determine whether the user can update task status.
   */
  updateStatus(user: AuthUser, task: TaskEntity): boolean {
    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if ((task.creatorId === user.id || task.assignedTo === user.id) &&
        user.hasPermission(Permission.UPDATE_TASK_STATUS)) {
      return true;
    }

    if (user.hasPermission(Permission.MANAGE_PROJECT_TASKS)) {
      return this.canUserAccessProjectTasks(user, task);
    }

    return false;
  }

  /**
   * Determine whether the user can delete the task.
   */
  delete(user: AuthUser, task: TaskEntity): boolean {
    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if (task.creatorId === user.id && user.hasPermission(Permission.DELETE_TASKS)) {
      return true;
    }

    if (user.hasPermission(Permission.MANAGE_PROJECT_TASKS)) {
      return this.canUserAccessProjectTasks(user, task);
    }

    return false;
  }

  /**
   * Determine whether the user can assign the task to someone.
   */
  assign(user: AuthUser, task: TaskEntity): boolean {
    if (task.status === 'completed') {
      return false;
    }

    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if (task.creatorId === user.id) {
      return true;
    }

    if (user.hasPermission(Permission.MANAGE_PROJECT_TASKS)) {
      return this.canUserAccessProjectTasks(user, task);
    }

    return false;
  }

  /**
   * Determine whether the user can change task priority.
   */
  changePriority(user: AuthUser, task: TaskEntity): boolean {
    if (task.status === 'completed') {
      return false;
    }

    if (user.hasPermission(Permission.MANAGE_ALL_TASKS)) {
      return true;
    }

    if (task.creatorId === user.id) {
      return true;
    }

    if (user.hasPermission(Permission.MANAGE_PROJECT_TASKS)) {
      return this.canUserAccessProjectTasks(user, task);
    }

    return false;
  }

  /**
   * Determine whether the user can create reminders for the task.
   */
  createReminder(user: AuthUser, task: TaskEntity): boolean {
    if (task.status === 'completed') {
      return false;
    }

    if (task.creatorId === user.id || task.assignedTo === user.id) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can access project tasks
   */
  private canUserAccessProjectTasks(user: AuthUser, task: TaskEntity): boolean {
    if (task.project) {
      if (task.project.ownerId === user.id) {
        return true;
      }

      if (task.project.members) {
        const member = task.project.members.find((m: any) => m.userId === user.id);
        return member !== undefined;
      }
    }

    return false;
  }
}
