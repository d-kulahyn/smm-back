<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Task;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Models\Task as TaskModel;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentTaskReadRepository implements TaskReadRepositoryInterface
{
    public function findById(int $id): ?Task
    {
        $model = TaskModel::find($id);

        return $model ? Task::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId, array $filters = []): Collection
    {
        $query = TaskModel::where('project_id', $projectId);

        $this->applyFilters($query, $filters);

        $models = $query->orderBy('due_date', 'asc')
                       ->orderBy('priority', 'desc')
                       ->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function findByCustomerId(int $customerId, array $filters = []): Collection
    {
        $query = TaskModel::where('customer_id', $customerId);

        $this->applyFilters($query, $filters);

        $models = $query->orderBy('due_date', 'asc')->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function findOverdueTasks(): Collection
    {
        $models = TaskModel::where('due_date', '<', now())
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function findByAssignedTo(int $assignedTo): Collection
    {
        $models = TaskModel::where('assigned_to', $assignedTo)
            ->orderBy('due_date', 'asc')
            ->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function findByProjectIdPaginated(int $projectId, array $filters = [], int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        $query = TaskModel::where('project_id', $projectId);

        $this->applyFilters($query, $filters);

        return $query->orderBy('due_date', 'asc')
                     ->orderBy('priority', 'desc')
                     ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByCustomerIdPaginated(int $customerId, array $filters = [], int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        $query = TaskModel::where('customer_id', $customerId);

        $this->applyFilters($query, $filters);

        return $query->orderBy('due_date', 'asc')
                     ->orderBy('priority', 'desc')
                     ->paginate($perPage, ['*'], 'page', $page);
    }

    private function applyFilters($query, array $filters): void
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        if (isset($filters['overdue']) && $filters['overdue']) {
            $query->where('due_date', '<', now())
                  ->whereNotIn('status', ['completed', 'cancelled']);
        }
    }
}
