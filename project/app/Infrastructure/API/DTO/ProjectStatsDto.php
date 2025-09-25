<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

readonly class ProjectStatsDto
{
    public function __construct(
        public int $total_tasks,
        public int $completed_tasks,
        public int $pending_tasks,
        public int $overdue_tasks,
        public float $completion_percentage,
    ) {}

    public static function create(
        int $totalTasks,
        int $completedTasks,
        int $pendingTasks,
        int $overdueTasks
    ): self {
        $completionPercentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0.0;

        return new self(
            total_tasks: $totalTasks,
            completed_tasks: $completedTasks,
            pending_tasks: $pendingTasks,
            overdue_tasks: $overdueTasks,
            completion_percentage: $completionPercentage
        );
    }
}
