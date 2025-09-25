<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Project;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ProjectResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var Project $resource */
        $resource = $this->resource;

        return [
            'id'           => $resource->id,
            'name'         => $resource->name,
            'description'  => $resource->description,
            'status'       => $resource->status,
            'customer_id'  => $resource->customer_id,
            'start_date'   => $this->formatDate($resource->start_date),
            'end_date'     => $this->formatDate($resource->end_date),
            'budget'       => $resource->budget,
            'metadata'     => $resource->metadata,
            'is_active'    => $resource->isActive(),
            'is_completed' => $resource->isCompleted(),
            'stats'        => $resource->statsDto,
            'avatar'       => $resource->avatar ? Storage::url($resource->avatar) : null,
            'color'        => $resource->color,
            'created_at'   => $this->formatCreatedAt($resource->created_at),
            'updated_at'   => $this->formatUpdatedAt($resource->updated_at),
            'tasks'        => TaskResource::collection($resource->tasks),
            'members'      => ProjectMemberResource::collection($resource->members),
            'invitations'  => ProjectInvitationResource::collection($resource->invitations),
            'chats'        => ChatResource::collection($resource->chats),
        ];
    }
}
