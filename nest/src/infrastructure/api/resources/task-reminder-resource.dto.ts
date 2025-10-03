import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';

export class TaskReminderResource {
  id: string;
  task_id: string;
  remind_at: FormattedDate;
  message?: string;
  is_sent: boolean;
  sent_at?: FormattedDate;
  created_at: FormattedDate;

  constructor(reminder: any) {
    this.id = reminder.id;
    this.task_id = reminder.taskId;
    this.remind_at = DateFormatter.formatDateWithRelative(reminder.remindAt);
    this.message = reminder.message;
    this.is_sent = reminder.isSent || false;
    this.sent_at = reminder.sentAt ? DateFormatter.formatDateWithRelative(reminder.sentAt) : null;
    this.created_at = DateFormatter.formatCreatedAt(reminder.createdAt);
  }

  static fromEntity(reminder: any): TaskReminderResource {
    return new TaskReminderResource(reminder);
  }

  static collection(reminders: any[]): TaskReminderResource[] {
    return reminders.map(reminder => new TaskReminderResource(reminder));
  }
}
