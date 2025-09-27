<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectInvitation;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectInvitationReadRepositoryInterface
{
    public function findById(int $id): ?ProjectInvitation;

    public function findByToken(string $token): ?ProjectInvitation;

    public function findByProjectId(int $projectId): array;

    public function findByProjectIdPaginated(int $projectId, PaginationParamsDto $paginationParamsDto): LengthAwarePaginator;

    public function findByEmail(string $email): array;
    public function findPendingInvitationByUserIdAndProjectId(int $projectId, int $userId): array;

    public function findByUserId(int $userId): array;

    public function findByUserIdPaginated(int $userId, PaginationParamsDto $paginationParamsDto): LengthAwarePaginator;

    public function findPendingByProject(int $projectId): array;

    public function findExpiredInvitations(): array;
}
