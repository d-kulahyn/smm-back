<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Task;
use App\Infrastructure\API\DTO\CreateTaskUseCaseDto;
use App\Infrastructure\API\DTO\UpdateTaskUseCaseDto;

interface TaskWriteRepositoryInterface
{
    public function create(CreateTaskUseCaseDto $dto): Task;

    public function update(int $id, UpdateTaskUseCaseDto $dto): Task;

    public function delete(int $id): bool;

    public function markAsCompleted(int $id): Task;

    public function updateStatus(int $id, string $status): Task;
}
