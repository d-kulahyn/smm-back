<?php

declare(strict_types=1);

namespace App\Domain\Event;

use App\Domain\Enum\PermissionEnum;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocialMediaAccountDisconnectedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public string $platform,
        public string $accountName
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::MANAGE_SOCIAL_ACCOUNTS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return null;
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function broadcastWith(): array
    {
        return [
            'disconnected_account' => [
                'platform' => $this->platform,
                'account_name' => $this->accountName
            ]
        ];
    }

    public function broadcastAs(): string
    {
        return 'socialAccountDisconnected';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
