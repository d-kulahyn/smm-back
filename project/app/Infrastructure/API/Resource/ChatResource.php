<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Chat;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var Chat $resource */
        $resource = $this->resource;

        return [
            'id'               => $resource->id,
            'project_id'       => $resource->project_id,
            'customer_id'      => $resource->customer_id,
            'title'            => $resource->title,
            'description'      => $resource->description,
            'status'           => $resource->status,
            'is_active'        => $resource->isActive(),
            'is_archived'      => $resource->isArchived(),
            'unread_messages_count' => $resource->unread_messages_count ?? 0,
            'created_at'       => $this->formatDate($resource->created_at),
            'updated_at'       => $this->formatDate($resource->updated_at),
        ];
    }
}
