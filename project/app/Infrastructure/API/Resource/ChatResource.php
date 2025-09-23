<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Chat;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'message'          => $resource->message,
            'message_type'     => $resource->message_type,
            'sender_type'      => $resource->sender_type,
            'file_path'        => $resource->file_path ? Storage::url($resource->file_path) : null,
            'file_name'        => $resource->file_name,
            'file_size'        => $resource->file_size,
            'is_read'          => $resource->is_read,
            'read_at'          => $this->formatDate($resource->read_at),
            'is_voice_message' => $resource->isVoiceMessage(),
            'is_from_customer' => $resource->isFromCustomer(),
            'metadata'         => $resource->metadata,
            'customer'         => $resource->customer ? new CustomerResource($resource->customer) : null,
            'created_at'       => $this->formatCreatedAt($resource->created_at),
            'updated_at'       => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
