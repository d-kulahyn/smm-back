import { TaskResponseDto } from './task-response.dto';
export declare class TaskListResponseDto {
    success: boolean;
    data: TaskResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}
