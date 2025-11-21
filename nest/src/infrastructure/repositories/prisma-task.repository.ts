import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus, TaskPriority } from '../../domain/enums';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignments: true
      }
    });

    return task ? this.toDomain(task) : null;
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignments: true
      }
    });

    return tasks.map(this.toDomain);
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { creatorId },
      include: {
        assignments: true
      }
    });

    return tasks.map(this.toDomain);
  }

  async findByCreatorIdPaginated(
    creatorId: string,
    page: number,
    perPage: number,
    filters?: any
  ): Promise<{ data: Task[]; meta: any }> {
    const skip = (page - 1) * perPage;

    const where: any = { creatorId };

    if (filters) {
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.overdue) {
        where.dueDate = {
          lt: new Date()
        };
        where.status = {
          not: 'completed'
        };
      }
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      if (filters.assignedTo) {
        where.assignments = {
          some: {
            userId: filters.assignedTo
          }
        };
      }
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignments: true
        },
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.task.count({ where })
    ]);

    return {
      data: tasks.map(this.toDomain),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage)
      }
    };
  }

  async findByAssignedTo(assignedTo: string, page: number, perPage: number): Promise<{ data: Task[]; meta: any }> {
    const skip = (page - 1) * perPage;

    const where = {
      assignments: {
        some: {
          userId: assignedTo
        }
      }
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignments: true
        },
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.task.count({ where })
    ]);

    return {
      data: tasks.map(this.toDomain),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage)
      }
    };
  }

  async findOverdueByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          {
            assignments: {
              some: {
                userId: userId
              }
            }
          }
        ],
        dueDate: {
          lt: new Date()
        },
        status: {
          not: 'completed'
        }
      },
      include: {
        assignments: true
      }
    });

    return tasks.map(this.toDomain);
  }

  async getUserTaskStatistics(userId: string): Promise<any> {
    const where = {
      OR: [
        { creatorId: userId },
        {
          assignments: {
            some: {
              userId: userId
            }
          }
        }
      ]
    };

    const [total, completed, pending, inProgress, overdue] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.count({
        where: {
          ...where,
          status: 'completed'
        }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          status: 'pending'
        }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          status: 'on_hold'
        }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          dueDate: {
            lt: new Date()
          },
          status: {
            not: 'completed'
          }
        }
      })
    ]);

    return {
      total,
      completed,
      pending,
      inProgress: inProgress,
      overdue
    };
  }

  async create(task: Task): Promise<Task> {
    const taskData: any = {
      id: task.id,
      title: task.title,
      projectId: task.projectId,
      creatorId: task.creatorId,
      status: task.status,
      priority: task.priority,
    };

    if (task.description !== undefined) {
      taskData.description = task.description;
    }
    if (task.dueDate !== undefined) {
      taskData.dueDate = task.dueDate;
    }
    if (task.completedAt !== undefined) {
      taskData.completedAt = task.completedAt;
    }
    if (task.assignedTo !== undefined) {
      taskData.assignedTo = task.assignedTo;
    }
    if (task.reminderBeforeHours !== undefined) {
      taskData.reminderBeforeHours = task.reminderBeforeHours;
    }

    const created = await this.prisma.task.create({
      data: taskData,
    });

    if (task.assignedTo) {
      await this.prisma.taskAssignment.create({
        data: {
          taskId: created.id,
          userId: task.assignedTo,
        },
      });
    }

    return this.toDomain(created);
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const updateData: any = {};

    if (taskData.title !== undefined) {
      updateData.title = taskData.title;
    }
    if (taskData.description !== undefined) {
      updateData.description = taskData.description;
    }
    if (taskData.status !== undefined) {
      updateData.status = taskData.status;
    }
    if (taskData.priority !== undefined) {
      updateData.priority = taskData.priority;
    }
    if (taskData.dueDate !== undefined) {
      updateData.dueDate = taskData.dueDate;
    }
    if (taskData.completedAt !== undefined) {
      updateData.completedAt = taskData.completedAt;
    }
    if (taskData.assignedTo !== undefined) {
      updateData.assignedTo = taskData.assignedTo;
    }
    if (taskData.reminderBeforeHours !== undefined) {
      updateData.reminderBeforeHours = taskData.reminderBeforeHours;
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignments: true
      }
    });

    if (taskData.assignedTo !== undefined) {
      await this.prisma.taskAssignment.deleteMany({
        where: { taskId: id }
      });

      if (taskData.assignedTo) {
        await this.prisma.taskAssignment.create({
          data: {
            taskId: id,
            userId: taskData.assignedTo
          }
        });
      }
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  private toDomain(task: any): Task {
    const assignedTo = task.assignments && task.assignments.length > 0
      ? task.assignments[0].userId
      : task.assignedTo;

    return new Task(
      task.id,
      task.title,
      task.projectId,
      task.creatorId,
      task.description,
      task.status as TaskStatus,
      task.priority as TaskPriority,
      assignedTo,
      task.completedAt,
      task.dueDate,
      task.reminderBeforeHours,
      task.createdAt,
      task.updatedAt,
    );
  }
}
