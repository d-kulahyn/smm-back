<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\TaskReminder;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskReminderResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var TaskReminder $resource */
        $resource = $this->resource;

        return [
            'id'            => $resource->id,
            'task_id'       => $resource->task_id,
            'customer_id'   => $resource->customer_id,
            'remind_at'     => $this->formatDate($resource->remind_at),
            'reminder_type' => $resource->reminder_type,
            'message'       => $resource->message,
            'is_sent'       => $resource->is_sent,
            'sent_at'       => $this->formatDate($resource->sent_at),
            'is_due'        => $resource->isDue(),
            'metadata'      => $resource->metadata,
            'created_at'    => $this->formatCreatedAt($resource->created_at),
            'updated_at'    => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
