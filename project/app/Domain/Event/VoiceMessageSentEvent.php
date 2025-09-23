<?php

declare(strict_types=1);

namespace App\Domain\Event;

use App\Domain\Entity\Chat;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\ChatResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VoiceMessageSentEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public Chat $chat
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_PROJECT_CHATS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->chat->customer_id;
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel("chat:{$this->projectId}");
    }

    public function broadcastWith(): array
    {
        return ['voice_message' => new ChatResource($this->chat)];
    }

    public function broadcastAs(): string
    {
        return 'voiceMessageSent';
    }
}
