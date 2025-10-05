import { FormattedDate } from '../../../shared/formatters/date.formatter';
import { TaskReminderResource } from './task-reminder-resource.dto';
export declare class TaskResource {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    project_id: string;
    customer_id?: string;
    assigned_to?: string;
    due_date?: string;
    completed_at?: string;
    notes?: string;
    is_completed: boolean;
    is_overdue: boolean;
    metadata?: any;
    created_at: FormattedDate;
    updated_at: FormattedDate;
    project?: any;
    assignee?: any;
    creator?: any;
    reminders: TaskReminderResource[];
    constructor(task: any);
    static fromEntity(task: any): TaskResource;
    static collection(tasks: any[]): TaskResource[];
}
