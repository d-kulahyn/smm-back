<?php

declare(strict_types=1);

namespace App\Domain\Notification;

use App\Infrastructure\Notification\PostNotificationCallback;
use App\Domain\Repository\TaskReminderWriteRepositoryInterface;

readonly class TaskReminderPostCallback implements PostNotificationCallback
{

    public function __construct(
        private int $taskReminderId,
        private TaskReminderWriteRepositoryInterface $repository,
    ) {}

    public function execute(): void
    {
        $this->repository->markAsSent($this->taskReminderId);
    }
}
