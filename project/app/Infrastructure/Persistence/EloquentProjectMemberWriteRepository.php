<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Infrastructure\Mapper\ProjectMemberMapper;
use App\Models\ProjectMember as EloquentProjectMember;

class EloquentProjectMemberWriteRepository implements ProjectMemberWriteRepositoryInterface
{
    public function __construct(
        private readonly ProjectMemberMapper $mapper
    ) {}

    public function create(array $data): ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::create($data);
        $eloquentProjectMember->load('user');

        return $this->mapper->toDomain($eloquentProjectMember);
    }

    public function update(int $id, array $data): ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::findOrFail($id);
        $eloquentProjectMember->update($data);
        $eloquentProjectMember->load('user');

        return $this->mapper->toDomain($eloquentProjectMember);
    }

    public function delete(int $id): bool
    {
        return EloquentProjectMember::destroy($id) > 0;
    }

    public function addMember(int $projectId, int $userId, string $role, array $permissions = []): ProjectMember
    {
        $data = [
            'project_id' => $projectId,
            'user_id' => $userId,
            'role' => $role,
            'permissions' => $permissions,
            'joined_at' => now(),
        ];

        return $this->create($data);
    }

    public function updateRole(int $projectId, int $userId, string $role): ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->firstOrFail();

        return $this->update($eloquentProjectMember->id, ['role' => $role]);
    }

    public function updatePermissions(int $projectId, int $userId, array $permissions): ProjectMember
    {
        $eloquentProjectMember = EloquentProjectMember::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->firstOrFail();

        return $this->update($eloquentProjectMember->id, ['permissions' => $permissions]);
    }

    public function removeMember(int $projectId, int $userId): bool
    {
        return EloquentProjectMember::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->delete() > 0;
    }
}
