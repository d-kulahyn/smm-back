<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Task;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var Task $resource */
        $resource = $this->resource;

        return [
            'id'           => $resource->id,
            'title'        => $resource->title,
            'description'  => $resource->description,
            'status'       => $resource->status,
            'priority'     => $resource->priority,
            'project_id'   => $resource->project_id,
            'customer_id'  => $resource->customer_id,
            'assigned_to'  => $resource->assigned_to,
            'due_date'     => $this->formatDate($resource->due_date),
            'completed_at' => $this->formatDate($resource->completed_at),
            'notes'        => $resource->notes,
            'is_completed' => $resource->isCompleted(),
            'is_overdue'   => $resource->isOverdue(),
            'metadata'     => $resource->metadata,
            'created_at'   => $this->formatCreatedAt($resource->created_at),
            'updated_at'   => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
