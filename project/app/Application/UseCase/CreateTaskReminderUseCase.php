<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\TaskReminder;
use App\Domain\Exception\TaskCannotCreateReminderException;
use App\Domain\Exception\TaskNotFoundException;
use App\Domain\Repository\TaskReminderWriteRepositoryInterface;
use App\Domain\Repository\TaskReadRepositoryInterface;
use Carbon\Carbon;

readonly class CreateTaskReminderUseCase
{
    public function __construct(
        private TaskReminderWriteRepositoryInterface $taskReminderWriteRepository,
        private TaskReadRepositoryInterface $taskReadRepository
    ) {}

    /**
     * @throws TaskNotFoundException
     * @throws TaskCannotCreateReminderException
     */
    public function execute(int $taskId, int $customerId, int $hoursBefore, string $reminderType = 'push'): TaskReminder
    {
        $task = $this->taskReadRepository->findById($taskId);

        if (!$task) {
            throw new TaskNotFoundException();
        }

        if (!$task->due_date) {
            throw new TaskCannotCreateReminderException();
        }

        $remindAt = Carbon::parse($task->due_date)->subHours($hoursBefore);

        $data = [
            'task_id' => $taskId,
            'customer_id' => $customerId,
            'remind_at' => $remindAt->toDateTimeString(),
            'reminder_type' => $reminderType,
            'message' => "Напоминание: задача '{$task->title}' должна быть выполнена {$task->due_date}",
            'is_sent' => false,
        ];

        return $this->taskReminderWriteRepository->create($data);
    }
}
