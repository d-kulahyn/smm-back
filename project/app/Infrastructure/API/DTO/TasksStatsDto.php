<?php

namespace App\Infrastructure\API\DTO;

class TasksStatsDto
{
    public function __construct(
        public readonly int $totalTasks = 0,
        public readonly int $completedTasks = 0,
        public readonly int $pendingTasks = 0,
        public readonly int $overdueTasks = 0,
        public readonly float $completionPercentage = 0.0
    ) {}

    public static function fromArray(array $stats): self
    {
        return new self(
            totalTasks: $stats['total_tasks'] ?? 0,
            completedTasks: $stats['completed_tasks'] ?? 0,
            pendingTasks: $stats['pending_tasks'] ?? 0,
            overdueTasks: $stats['overdue_tasks'] ?? 0,
            completionPercentage: $stats['completion_percentage'] ?? 0.0
        );
    }

    public function toArray(): array
    {
        return [
            'total_tasks' => $this->totalTasks,
            'completed_tasks' => $this->completedTasks,
            'pending_tasks' => $this->pendingTasks,
            'overdue_tasks' => $this->overdueTasks,
            'completion_percentage' => $this->completionPercentage,
        ];
    }
}
