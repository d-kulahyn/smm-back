<?php

namespace App\Domain\Event;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\SocialMediaAccountResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocialMediaAccountConnectedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public SocialMediaAccount $socialMediaAccount
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::MANAGE_SOCIAL_ACCOUNTS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return null; // Владелец определяется через проект
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function broadcastWith(): array
    {
        return ['social_account' => new SocialMediaAccountResource($this->socialMediaAccount)];
    }

    public function broadcastAs(): string
    {
        return 'socialAccountConnected';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
