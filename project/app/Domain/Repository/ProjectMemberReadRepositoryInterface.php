<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectMember;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectMemberReadRepositoryInterface
{
    public function findById(int $id): ?ProjectMember;

    public function findByProjectId(int $projectId): array;

    public function findByUserId(int $userId): array;

    public function findByProjectAndUser(int $projectId, int $userId): ?ProjectMember;

    public function findByRole(int $projectId, string $role): array;

    public function findByProjectIdPaginated(int $projectId, PaginationParamsDto $pagination): LengthAwarePaginator;

    public function findByProjectAndUserId(int $projectId, int $userId): ?ProjectMember;
}
