<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Task;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TaskReadRepositoryInterface
{
    public function findById(int $id): ?Task;

    public function findByProjectId(int $projectId, array $filters = []): Collection;

    public function findByProjectIdPaginated(int $projectId, array $filters = [], int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function findByCustomerId(int $customerId, array $filters = []): Collection;

    public function findByCustomerIdPaginated(int $customerId, array $filters = [], int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function findOverdueTasks(): Collection;

    public function findByAssignedTo(int $assignedTo): Collection;
}
