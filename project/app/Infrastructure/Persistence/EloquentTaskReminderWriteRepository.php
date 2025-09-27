<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\TaskReminder;
use App\Models\TaskReminder as TaskReminderModel;
use App\Domain\Repository\TaskReminderWriteRepositoryInterface;

class EloquentTaskReminderWriteRepository implements TaskReminderWriteRepositoryInterface
{
    public function create(array $data): TaskReminder
    {
        $model = TaskReminderModel::create($data);

        return TaskReminder::from($model->toArray());
    }

    public function markAsSent(int $id): TaskReminder
    {
        $model = TaskReminderModel::findOrFail($id);
        $model->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);

        return TaskReminder::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return TaskReminderModel::destroy($id) > 0;
    }
}
