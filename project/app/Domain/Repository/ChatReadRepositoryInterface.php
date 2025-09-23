<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Chat;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ChatReadRepositoryInterface
{
    public function findById(int $id): ?Chat;

    public function findByProjectId(int $projectId, int $limit = 50): Collection;

    public function findByProjectIdPaginated(int $projectId, PaginationParamsDto $paramsDto): LengthAwarePaginator;

    public function getUnreadCount(int $projectId, int $excludeCustomerId): int;

    public function findByCustomerId(int $customerId): Collection;
}
