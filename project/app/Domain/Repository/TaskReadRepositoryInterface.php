<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Task;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use App\Infrastructure\API\DTO\Filters\TaskFilterDto;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TaskReadRepositoryInterface
{
    public function findById(int $id): ?Task;

    public function findByProjectId(int $projectId, ?TaskFilterDto $filters = null): Collection;

    public function paginate(PaginationParamsDto $pagination, ?TaskFilterDto $filters = null): LengthAwarePaginator;

    public function findByCustomerId(int $customerId, ?TaskFilterDto $filters = null): Collection;

    public function findByCustomerIdPaginated(int $customerId, PaginationParamsDto $pagination, ?TaskFilterDto $filters = null): LengthAwarePaginator;

    public function findOverdueTasks(): Collection;

    public function findByAssignedTo(int $assignedTo): Collection;
}
