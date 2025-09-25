<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectReadRepositoryInterface
{
    public function findById(int $id): ?Project;

    public function findByCustomerIdPaginated(int $customerId, int $page = 1, int $perPage = 10): LengthAwarePaginator;

    public function getProjectsStats(array $projectIds): array;

    public function exists(int $id): bool;

    public function getMultipleProjectsTasks(array $projectIds, int $limit = 5): array;
}
