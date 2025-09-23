<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ProjectInvitation;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInvitationResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var ProjectInvitation $resource */
        $resource = $this->resource;

        return [
            'id' => $resource->id,
            'project_id' => $resource->project_id,
            'invited_by' => $resource->invited_by,
            'invited_user_id' => $resource->invited_user_id,
            'email' => $resource->email,
            'role' => $resource->role,
            'permissions' => $resource->permissions,
            'status' => $resource->status,
            'token' => $resource->token,
            'expires_at' => $this->formatDate($resource->expires_at),
            'accepted_at' => $this->formatDate($resource->accepted_at),
            'declined_at' => $this->formatDate($resource->declined_at),
            'is_pending' => $resource->isPending(),
            'is_expired' => $resource->isExpired(),
            'can_be_accepted' => $resource->canBeAccepted(),
            'invited_by_user' => $resource->invitedBy ? new CustomerResource($resource->invitedBy) : null,
            'invited_user' => $resource->invitedUser ? new CustomerResource($resource->invitedUser) : null,
            'created_at' => $this->formatCreatedAt($resource->created_at),
            'updated_at' => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
