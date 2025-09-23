<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Task;
use App\Domain\Event\TaskCreatedEvent;
use App\Domain\Event\TaskAssignedEvent;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;

class CreateTaskUseCase
{
    public function __construct(
        private TaskWriteRepositoryInterface $taskWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(array $data): Task
    {
        // Проверяем существование проекта через исключение
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        $task = $this->taskWriteRepository->create($data);

        // Отправляем событие создания задачи
        event(new TaskCreatedEvent($data['project_id'], $task));

        // Если задача назначена, отправляем событие назначения
        if (isset($data['assigned_to']) && $data['assigned_to']) {
            event(new TaskAssignedEvent($data['assigned_to'], $task));
        }

        return $task;
    }
}
