<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\TaskReminder;

interface TaskReminderWriteRepositoryInterface
{
    public function create(array $data): TaskReminder;

    public function markAsSent(int $id): TaskReminder;

    public function delete(int $id): bool;
}
