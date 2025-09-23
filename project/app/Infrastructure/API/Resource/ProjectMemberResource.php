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
            'id' => $resource->id,
            'project_id' => $resource->project_id,
            'user_id' => $resource->user_id,
            'role' => $resource->role,
            'permissions' => $resource->permissions,
            'joined_at' => $this->formatDate($resource->joined_at),
            'user' => $resource->user ? new CustomerResource($resource->user) : null,
            'created_at' => $this->formatCreatedAt($resource->created_at),
            'updated_at' => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
