import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
export declare class CompleteTaskUseCase {
    private readonly taskRepository;
    constructor(taskRepository: TaskRepository);
    execute(taskId: string): Promise<Task>;
}
