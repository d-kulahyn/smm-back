<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Task;

interface TaskWriteRepositoryInterface
{
    public function create(array $data): Task;

    public function update(int $id, array $data): Task;

    public function delete(int $id): bool;

    public function markAsCompleted(int $id): Task;

    public function updateStatus(int $id, string $status): Task;
}
