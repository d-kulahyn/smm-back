<?php

declare(strict_types=1);

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ChatMember;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMemberResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray(Request $request): array
    {
        /** @var ChatMember $resource */
        $resource = $this->resource;

        return [
            'id'         => $resource->id,
            'chat_id'    => $resource->chat_id,
            'user_id'    => $resource->user_id,
            'joined_at'  => $this->formatDateWithRelative($resource->joined_at),
            'created_at' => $this->formatDateWithRelative($resource->created_at),
            'updated_at' => $this->formatDateWithRelative($resource->updated_at),
        ];
    }
}
