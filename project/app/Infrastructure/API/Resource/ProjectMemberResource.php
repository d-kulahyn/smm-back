<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ProjectMember;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectMemberResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var ProjectMember $resource */
        $resource = $this->resource;

        return [
            'id'          => $resource->id,
            'project_id'  => $resource->projectId,
            'user_id'     => $resource->userId,
            'role'        => $resource->role,
            'permissions' => $resource->permissions,
            'joined_at'  => $this->formatCreatedAt($resource->joinedAt),
        ];
    }
}
