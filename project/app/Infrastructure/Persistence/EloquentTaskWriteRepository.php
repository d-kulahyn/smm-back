<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Enum\TaskStatusEnum;
use App\Domain\Entity\Task;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateTaskUseCaseDto;
use App\Infrastructure\API\DTO\UpdateTaskUseCaseDto;
use App\Models\Task as TaskModel;

class EloquentTaskWriteRepository implements TaskWriteRepositoryInterface
{
    public function create(CreateTaskUseCaseDto $dto): Task
    {
        $model = TaskModel::create($dto->toArray());

        return Task::from($model->toArray());
    }

    public function update(int $id, UpdateTaskUseCaseDto $dto): Task
    {
        $model = TaskModel::findOrFail($id);
        $model->update($dto->toArray());

        return Task::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return TaskModel::destroy($id) > 0;
    }

    public function markAsCompleted(int $id): ?Task
    {
        $model = TaskModel::find($id);

        if (!$model) {
            return null;
        }

        $model->update([
            'status' => TaskStatusEnum::COMPLETED->value,
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
