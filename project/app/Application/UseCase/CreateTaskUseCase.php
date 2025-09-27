<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Task;
use App\Domain\Event\TaskCreatedEvent;
use App\Domain\Event\TaskAssignedEvent;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Exception\TaskCannotCreateReminderException;
use App\Domain\Exception\TaskNotFoundException;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Infrastructure\API\DTO\CreateTaskUseCaseDto;

readonly class CreateTaskUseCase
{
    public function __construct(
        private CreateTaskReminderUseCase $createTaskReminderUseCase,
        private TaskWriteRepositoryInterface $taskWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    /**
     * @throws TaskNotFoundException
     * @throws TaskCannotCreateReminderException
     * @throws ProjectNotFoundException
     */
    public function execute(CreateTaskUseCaseDto $dto): Task
    {
        if (!$this->projectReadRepository->exists($dto->project_id)) {
            throw new ProjectNotFoundException();
        }

        $task = $this->taskWriteRepository->create($dto);

        event(new TaskCreatedEvent($dto->project_id, $task));

        if ($dto->hasAssignedUser()) {
            event(new TaskAssignedEvent($dto->assigned_to, $task));
        }

        if ($dto->reminder_before_hours && $dto->due_date) {
            $this->createTaskReminderUseCase->execute($task->id, $dto->assigned_to, $dto->reminder_before_hours);
        }

        return $task;
    }
}
