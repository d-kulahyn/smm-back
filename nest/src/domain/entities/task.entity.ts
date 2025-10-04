import { TaskStatus, TaskPriority } from '../enums';

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly projectId: string,
    public readonly creatorId: string,
    public readonly description?: string,
    public readonly status: TaskStatus = TaskStatus.pending,
    public readonly priority: TaskPriority = TaskPriority.MEDIUM,
    public readonly assignedTo?: string,
    public readonly completedAt?: Date,
    public readonly dueDate?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  complete(): Task {
    return new Task(
      this.id,
      this.title,
      this.projectId,
      this.creatorId,
      this.description,
      TaskStatus.completed,
      this.priority,
      this.assignedTo,
      new Date(),
      this.dueDate,
      this.createdAt,
      new Date(),
    );
  }

  startProgress(): Task {
    return new Task(
      this.id,
      this.title,
      this.projectId,
      this.creatorId,
      this.description,
      TaskStatus.on_hold,
      this.priority,
      this.assignedTo,
      this.completedAt,
      this.dueDate,
      this.createdAt,
      new Date(),
    );
  }

  isCompleted(): boolean {
    return this.status === TaskStatus.completed;
  }

  isOverdue(): boolean {
    return this.dueDate ? new Date() > this.dueDate && !this.isCompleted() : false;
  }
}
