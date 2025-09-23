<?php

declare(strict_types=1);

namespace App\Domain\Event;

use App\Domain\Entity\Storybook;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\StorybookResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StorybookActivatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public Storybook $storybook
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::ACTIVATE_STORIES;
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
        return ['activated_story' => new StorybookResource($this->storybook)];
    }

    public function broadcastAs(): string
    {
        return 'storybookActivated';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
