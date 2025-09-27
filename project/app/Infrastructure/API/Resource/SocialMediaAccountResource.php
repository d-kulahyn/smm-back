<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\SocialMediaAccount;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class SocialMediaAccountResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var SocialMediaAccount $resource */
        $resource = $this->resource;

        return [
            'id'                 => $resource->id,
            'project_id'         => $resource->project_id,
            'platform'           => $resource->platform,
            'account_name'       => $resource->account_name,
            'account_id'         => $resource->account_id,
            'is_active'          => $resource->is_active,
            'is_connected'       => $resource->isConnected(),
            'is_token_expired'   => $resource->isTokenExpired(),
            'expires_at'         => $this->formatDate($resource->expires_at),
            'account_metadata'   => $resource->account_metadata,
            'permissions'        => $resource->permissions,
            'can_post'           => $resource->canPost(),
            'can_create_stories' => $resource->canCreateStories(),
            'created_at'         => $this->formatCreatedAt($resource->created_at),
            'updated_at'         => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
