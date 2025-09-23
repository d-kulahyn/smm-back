<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Project;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectReadRepositoryInterface
{
    public function findById(int $id): ?Project;

    public function findByCustomerId(int $customerId): Collection;

    public function findByCustomerIdPaginated(int $customerId, int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function findByCustomerIdPaginatedWithStats(int $customerId, int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function findByStatus(string $status): Collection;

    public function getProjectStats(int $projectId): array;

    public function exists(int $id): bool;

    public function getProjectTasks(int $projectId, int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function getProjectTasksCount(int $projectId): array;

    public function getMultipleProjectsTasksCount(array $projectIds): array;

    public function getMultipleProjectsTasks(array $projectIds, int $limit = 5): array;
}
