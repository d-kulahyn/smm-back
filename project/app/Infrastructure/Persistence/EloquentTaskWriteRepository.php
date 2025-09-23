<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Task;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Models\Task as TaskModel;

class EloquentTaskWriteRepository implements TaskWriteRepositoryInterface
{
    public function create(array $data): Task
    {
        $model = TaskModel::create($data);

        return Task::from($model->toArray());
    }

    public function update(int $id, array $data): Task
    {
        $model = TaskModel::findOrFail($id);
        $model->update($data);

        return Task::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return TaskModel::destroy($id) > 0;
    }

    public function markAsCompleted(int $id): Task
    {
        $model = TaskModel::findOrFail($id);
        $model->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return Task::from($model->fresh()->toArray());
    }

    public function updateStatus(int $id, string $status): Task
    {
        $model = TaskModel::findOrFail($id);
        $model->update(['status' => $status]);

        return Task::from($model->fresh()->toArray());
    }
}
