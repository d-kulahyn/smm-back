export declare class TaskResponseDto {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    project_id: string;
    assigned_to: string | null;
    due_date: string | null;
    completed_at: string | null;
    notes: string | null;
    is_completed: boolean;
    is_overdue: boolean;
    created_at: string;
    updated_at: string;
}
