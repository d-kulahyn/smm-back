<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\TaskReminder;
use App\Domain\Repository\TaskReminderReadRepositoryInterface;
use App\Models\TaskReminder as TaskReminderModel;
use Illuminate\Support\Collection;

class EloquentTaskReminderReadRepository implements TaskReminderReadRepositoryInterface
{
    public function findById(int $id): ?TaskReminder
    {
        $model = TaskReminderModel::find($id);

        return $model ? TaskReminder::from($model->toArray()) : null;
    }

    public function findByTaskId(int $taskId): Collection
    {
        $models = TaskReminderModel::where('task_id', $taskId)
            ->orderBy('remind_at', 'asc')
            ->get();

        return $models->map(fn($model) => TaskReminder::from($model->toArray()));
    }

    public function findByCustomerId(int $customerId): Collection
    {
        $models = TaskReminderModel::where('customer_id', $customerId)
            ->orderBy('remind_at', 'asc')
            ->get();

        return $models->map(fn($model) => TaskReminder::from($model->toArray()));
    }

    public function findPendingReminders(): Collection
    {
        $models = TaskReminderModel::where('is_sent', false)
            ->where('remind_at', '<=', now())
            ->get();

        return $models->map(fn($model) => TaskReminder::from($model->toArray()));
    }
}
