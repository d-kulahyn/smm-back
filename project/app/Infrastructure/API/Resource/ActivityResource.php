<?php

declare(strict_types=1);

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ActivityLog;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray(Request $request): array
    {
        /** @var ActivityLog $resource */
        $resource = $this->resource;

        return [
            'id'          => $resource->id,
            'group_id'    => $resource->groupId,
            'group_name'  => $resource->groupName,
            'action_type' => $resource->actionType,
            'details'     => $resource->details,
            'created_by'  => new CustomerResource($resource->createdBy),
            'created_at'  => $this->formatCreatedAt($resource->createdAt),
            'status'      => $resource->status->value,
        ];
    }
}

