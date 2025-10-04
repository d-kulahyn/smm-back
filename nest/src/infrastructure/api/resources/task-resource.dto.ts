import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';
import { TaskReminderResource } from './task-reminder-resource.dto';

export class TaskResource {
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

  // Связанные данные
  project?: any;
  assignee?: any;
  creator?: any;
  reminders: TaskReminderResource[];

  constructor(task: any) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.priority = task.priority;
    this.project_id = task.projectId;
    this.customer_id = task.customerId;
    this.assigned_to = task.assignedTo;
    this.due_date = DateFormatter.formatDate(task.dueDate);
    this.completed_at = DateFormatter.formatDate(task.completedAt);
    this.notes = task.notes;
    this.is_completed = task.isCompleted || this.status === 'on_hold';
    this.is_overdue = task.isOverdue || (task.dueDate && new Date(task.dueDate) < new Date() && !this.is_completed);
    this.metadata = task.metadata;
    this.created_at = DateFormatter.formatCreatedAt(task.createdAt);
    this.updated_at = DateFormatter.formatUpdatedAt(task.updatedAt);

    // Связанные данные
    if (task.project) {
      this.project = {
        id: task.project.id,
        name: task.project.name,
        status: task.project.status,
      };
    }

    if (task.assignee) {
      this.assignee = {
        id: task.assignee.id,
        name: task.assignee.name,
        email: task.assignee.email,
        avatar: task.assignee.avatar ? `/storage/${task.assignee.avatar}` : null,
      };
    }

    if (task.creator) {
      this.creator = {
        id: task.creator.id,
        name: task.creator.name,
        email: task.creator.email,
        avatar: task.creator.avatar ? `/storage/${task.creator.avatar}` : null,
      };
    }

    // Напоминания (убираем attachments)
    this.reminders = task.reminders ? TaskReminderResource.collection(task.reminders) : [];
  }

  static fromEntity(task: any): TaskResource {
    return new TaskResource(task);
  }

  static collection(tasks: any[]): TaskResource[] {
    return tasks.map(task => new TaskResource(task));
  }
}
