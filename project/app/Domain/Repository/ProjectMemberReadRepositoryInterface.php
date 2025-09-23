<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectMember;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectMemberReadRepositoryInterface
{
    public function findById(int $id): ?ProjectMember;

    public function findByProjectId(int $projectId): array;

    public function findByUserId(int $userId): array;

    public function findByProjectAndUser(int $projectId, int $userId): ?ProjectMember;

    public function findByRole(int $projectId, string $role): array;

    /**
     * Find project members with pagination and filters
     */
    public function findByProjectIdPaginated(int $projectId, int $page, int $perPage): LengthAwarePaginator;

    /**
     * Find project member by project and user ID
     */
    public function findByProjectAndUserId(int $projectId, int $userId): ?ProjectMember;
}
