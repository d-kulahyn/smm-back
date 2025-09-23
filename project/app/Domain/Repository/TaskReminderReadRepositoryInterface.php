<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\TaskReminder;
use Illuminate\Support\Collection;

interface TaskReminderReadRepositoryInterface
{
    public function findById(int $id): ?TaskReminder;

    public function findByTaskId(int $taskId): Collection;

    public function findByCustomerId(int $customerId): Collection;

    public function findPendingReminders(): Collection;
}
