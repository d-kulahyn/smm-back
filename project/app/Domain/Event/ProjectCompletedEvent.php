<?php

declare(strict_types=1);

namespace App\Domain\Event;

use App\Domain\Entity\Project;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\ProjectResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectCompletedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $customerId,
        public Project $project
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_OWN_PROJECTS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->customerId;
    }

    protected function getProjectId(): ?int
    {
        return $this->project->id;
    }

    public function broadcastOn(): Channel
    {
        return new Channel("project:{$this->customerId}");
    }

    public function broadcastWith(): array
    {
        return ['project' => new ProjectResource($this->project)];
    }

    public function broadcastAs(): string
    {
        return 'projectCompleted';
    }
}
