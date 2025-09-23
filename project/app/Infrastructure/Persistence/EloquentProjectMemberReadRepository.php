<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Infrastructure\Mapper\ProjectMemberMapper;
use App\Models\ProjectMember as EloquentProjectMember;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentProjectMemberReadRepository implements ProjectMemberReadRepositoryInterface
{
    public function __construct(
        private readonly ProjectMemberMapper $mapper
    ) {}

    public function findById(int $id): ?ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::with('user')->find($id);

        return $eloquentProjectMember ? $this->mapper->toDomain($eloquentProjectMember) : null;
    }

    public function findByProjectId(int $projectId): array
    {
        $eloquentMembers = EloquentProjectMember::with('user')
            ->where('project_id', $projectId)
            ->get();

        return $eloquentMembers->map(fn($member) => $this->mapper->toDomain($member))->toArray();
    }

    public function findByUserId(int $userId): array
    {
        $eloquentMembers = EloquentProjectMember::with(['user', 'project'])
            ->where('user_id', $userId)
            ->get();

        return $eloquentMembers->map(fn($member) => $this->mapper->toDomain($member))->toArray();
    }

    public function findByProjectAndUser(int $projectId, int $userId): ?ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::with('user')
            ->where('project_id', $projectId)
            ->where('user_id', $userId)
            ->first();

        return $eloquentProjectMember ? $this->mapper->toDomain($eloquentProjectMember) : null;
    }

    public function findByRole(int $projectId, string $role): array
    {
        $eloquentMembers = EloquentProjectMember::with('user')
            ->where('project_id', $projectId)
            ->where('role', $role)
            ->get();

        return $eloquentMembers->map(fn($member) => $this->mapper->toDomain($member))->toArray();
    }

    public function findByProjectIdPaginated(int $projectId, int $page, int $perPage): LengthAwarePaginator
    {
        $query = EloquentProjectMember::with(['user'])->where('project_id', $projectId);

        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByProjectAndUserId(int $projectId, int $userId): ?ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::with('user')
            ->where('project_id', $projectId)
            ->where('user_id', $userId)
            ->first();

        return $eloquentProjectMember ? $this->mapper->toDomain($eloquentProjectMember) : null;
    }
}
