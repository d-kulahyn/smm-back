<?php

namespace App\Domain\Event;

use App\Domain\Entity\Storybook;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\StorybookResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StorybookCreatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public Storybook $storybook
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_PROJECT_STORYBOOKS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->storybook->assigned_to;
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }
    public function broadcastWith(): array
    {
        return ['storybook' => new StorybookResource($this->storybook)];
    }

    public function broadcastAs(): string
    {
        return 'storybookCreated';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
