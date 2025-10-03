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
export declare class TaskPolicy {
    viewAny(user: AuthUser): boolean;
    view(user: AuthUser, task: TaskEntity): boolean;
    create(user: AuthUser): boolean;
    update(user: AuthUser, task: TaskEntity): boolean;
    updateStatus(user: AuthUser, task: TaskEntity): boolean;
    delete(user: AuthUser, task: TaskEntity): boolean;
    assign(user: AuthUser, task: TaskEntity): boolean;
    changePriority(user: AuthUser, task: TaskEntity): boolean;
    addAttachment(user: AuthUser, task: TaskEntity): boolean;
    createReminder(user: AuthUser, task: TaskEntity): boolean;
    private canUserAccessProjectTasks;
}
