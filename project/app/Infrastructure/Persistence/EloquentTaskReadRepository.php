<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Enum\TaskStatusEnum;
use App\Domain\Entity\Task;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use App\Infrastructure\API\DTO\Filters\TaskFilterDto;
use App\Models\Task as TaskModel;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class EloquentTaskReadRepository implements TaskReadRepositoryInterface
{
    public function findById(int $id): ?Task
    {
        $model = TaskModel::find($id);

        return $model ? Task::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId, ?TaskFilterDto $filters = null): Collection
    {
        $query = TaskModel::where('project_id', $projectId)
            ->whereNotIn('status', [TaskStatusEnum::COMPLETED->value, TaskStatusEnum::CANCELLED->value]);

        $this->applyFilters($query, $filters);

        $models = $query->orderBy('due_date', 'asc')
                       ->orderBy('priority', 'desc')
                       ->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function paginate(PaginationParamsDto $pagination, ?TaskFilterDto $filters = null): LengthAwarePaginator
    {
        $query = TaskModel::query();
        $this->applyFilters($query, $filters);

        return $query->orderBy('due_date')
                    ->orderBy('priority', 'desc')
                    ->paginate($pagination->perPage, ['*'], 'page', $pagination->page);
    }

    public function findByCustomerId(int $customerId, ?TaskFilterDto $filters = null): Collection
    {
        $query = TaskModel::where('customer_id', $customerId);

        $this->applyFilters($query, $filters);

        $models = $query->orderBy('due_date', 'asc')->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    public function findByCustomerIdPaginated(int $customerId, PaginationParamsDto $pagination, ?TaskFilterDto $filters = null): LengthAwarePaginator
    {
        $query = TaskModel::where('customer_id', $customerId);

        $this->applyFilters($query, $filters);

        return $query->orderBy('due_date', 'asc')
                    ->orderBy('priority', 'desc')
                    ->paginate($pagination->perPage, ['*'], 'page', $pagination->page);
    }

    public function findOverdueTasks(int $customerId): array
    {
        $tasks = TaskModel::whereHas('project', function ($query) use ($customerId) {
                $query->where('customer_id', $customerId);
            })
                  ->where('due_date', '<', now())
                  ->whereNotIn('status', [TaskStatusEnum::COMPLETED->value, TaskStatusEnum::CANCELLED->value]);

        return $tasks->get()->map(fn($model) => Task::from($model->toArray()))->toArray();
    }

    public function findByAssignedTo(int $assignedTo): Collection
    {
        $models = TaskModel::where('assigned_to', $assignedTo)->get();

        return $models->map(fn($model) => Task::from($model->toArray()));
    }

    private function applyFilters(Builder $query, ?TaskFilterDto $filters): void
    {
        if (!$filters) {
            return;
        }

        if ($filters->hasStatusFilter()) {
            $query->where('status', $filters->status);
        }

        if ($filters->hasPriorityFilter()) {
            $query->where('priority', $filters->priority);
        }

        if ($filters->hasAssignedToFilter()) {
            $query->where('assigned_to', $filters->assigned_to);
        }

        if ($filters->hasOverdueFilter() && $filters->overdue) {
            $query->where('due_date', '<', now())
                  ->whereNotIn('status', ['on_hold', 'cancelled']);
        }

        if ($filters->hasSearchFilter()) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters->search}%")
                  ->orWhere('description', 'like', "%{$filters->search}%");
            });
        }
    }
}
