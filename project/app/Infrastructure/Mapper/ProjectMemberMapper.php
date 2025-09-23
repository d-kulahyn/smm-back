<?php

declare(strict_types=1);

namespace App\Infrastructure\Mapper;

use App\Domain\Entity\ProjectMember;
use App\Models\ProjectMember as EloquentProjectMember;

class ProjectMemberMapper
{
    public function toDomain(EloquentProjectMember $eloquentProjectMember): ProjectMember
    {
        return new ProjectMember(
            id: $eloquentProjectMember->id,
            projectId: $eloquentProjectMember->project_id,
            userId: $eloquentProjectMember->user_id,
            role: $eloquentProjectMember->role,
            permissions: $eloquentProjectMember->permissions,
            joinedAt: $eloquentProjectMember->joined_at->toImmutable(),
            createdAt: $eloquentProjectMember->created_at->toImmutable(),
            updatedAt: $eloquentProjectMember->updated_at->toImmutable(),
            user: $eloquentProjectMember->user ? $this->customerMapper->toDomain($eloquentProjectMember->user) : null,
            project: null // Загружается отдельно при необходимости
        );
    }
}
