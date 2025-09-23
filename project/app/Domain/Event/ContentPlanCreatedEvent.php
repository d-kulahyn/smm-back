<?php

namespace App\Domain\Event;

use App\Domain\Entity\ContentPlan;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\ContentPlanResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContentPlanCreatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public ContentPlan $contentPlan
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_PROJECT_CONTENT_PLANS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->contentPlan->assigned_to;
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function broadcastWith(): array
    {
        return ['content_plan' => new ContentPlanResource($this->contentPlan)];
    }

    public function broadcastAs(): string
    {
        return 'contentPlanCreated';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
