import { FormattedDate } from '../../shared/formatters/date.formatter';
export declare class TaskReminderResource {
    id: string;
    task_id: string;
    remind_at: FormattedDate;
    message?: string;
    is_sent: boolean;
    sent_at?: FormattedDate;
    created_at: FormattedDate;
    constructor(reminder: any);
    static fromEntity(reminder: any): TaskReminderResource;
    static collection(reminders: any[]): TaskReminderResource[];
}
