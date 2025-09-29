<?php

namespace App\Domain\Event;

use App\Domain\Entity\Chat;
use App\Infrastructure\API\Resource\ChatMessageResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSentEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $initiatorId,
        public ChatMessageResource $message,
        protected Chat $chat
    ) {}

    public function broadcastAs(): string
    {
        return 'messageSent';
    }

    public function broadcastConnections(): array
    {
        return ['stream'];
    }

    public function broadcastOn(): array
    {
        $channels = [];

        foreach ($this->chat->members as $member) {
            if ($member->user_id === $this->initiatorId) {
                continue;
            }
            $channels[] = new Channel("socket.chats.{$this->chat->id}.{$member->user_id}");
        }

        return $channels;
    }
}
