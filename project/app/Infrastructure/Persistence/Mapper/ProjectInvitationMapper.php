<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Entity\Project;
use App\Domain\Entity\Customer;
use App\Models\ProjectInvitation as EloquentProjectInvitation;

class ProjectInvitationMapper
{
    public function toDomain(EloquentProjectInvitation $eloquentInvitation): ProjectInvitation
    {
        return new ProjectInvitation(
            id             : $eloquentInvitation->id,
            project_id     : $eloquentInvitation->project_id,
            invited_by     : $eloquentInvitation->invited_by,
            invited_user_id: $eloquentInvitation->invited_user_id,
            email          : $eloquentInvitation->email,
            role           : $eloquentInvitation->role,
            permissions    : $eloquentInvitation->permissions ?? [],
            status         : $eloquentInvitation->status,
            token          : $eloquentInvitation->token,
            expires_at     : $eloquentInvitation->expires_at?->toISOString(),
            accepted_at    : $eloquentInvitation->accepted_at?->toISOString(),
            declined_at    : $eloquentInvitation->declined_at?->toISOString(),
            created_at     : $eloquentInvitation->created_at?->toISOString(),
            updated_at     : $eloquentInvitation->updated_at?->toISOString(),
            project        : $eloquentInvitation->project ? Project::from($eloquentInvitation->project->toArray()) : null,
            invitedBy      : $eloquentInvitation->invitedBy ? Customer::from($eloquentInvitation->invitedBy->toArray()) : null,
            invitedUser    : $eloquentInvitation->invitedUser ? Customer::from($eloquentInvitation->invitedUser->toArray()) : null
        );
    }
}
