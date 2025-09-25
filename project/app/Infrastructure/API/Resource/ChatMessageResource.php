<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ChatMessage;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ChatMessageResource extends JsonResource
{
    use FormatsDatesTrait;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ChatMessage $resource */
        $resource = $this->resource;

        return [
            'id'               => $resource->id,
            'chat_id'          => $resource->chat_id,
            'project_id'       => $resource->project_id,
            'customer_id'      => $resource->customer_id,
            'message'          => $resource->message,
            'message_type'     => $resource->message_type,
            'sender_type'      => $resource->sender_type,
            'file_path'        => $resource->file_path ? Storage::url($resource->file_path) : null,
            'file_name'        => $resource->file_name,
            'file_size'        => $resource->file_size,
            'metadata'         => $resource->metadata,
            'is_voice_message' => $resource->isVoiceMessage(),
            'is_from_customer' => $resource->isFromCustomer(),
            'has_file'         => $resource->hasFile(),
            'created_at'       => $this->formatDate($resource->created_at),
            'updated_at'       => $this->formatDate($resource->updated_at),
        ];
    }
}
