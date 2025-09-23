<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectInvitation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectInvitationReadRepositoryInterface
{
    public function findById(int $id): ?ProjectInvitation;

    public function findByToken(string $token): ?ProjectInvitation;

    public function findByProjectId(int $projectId): array;

    public function findByProjectIdPaginated(int $projectId, int $page = 1, int $perPage = 15): LengthAwarePaginator;

    public function findByEmail(string $email): array;

    public function findByUserId(int $userId): array;

    public function findByUserIdPaginated(int $userId, int $page = 1, int $perPage = 15): LengthAwarePaginator;

    public function findPendingByProject(int $projectId): array;

    public function findExpiredInvitations(): array;
}
