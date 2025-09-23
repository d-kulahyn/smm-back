<?php

declare(strict_types=1);

namespace App\Domain\Event;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MediaFileDeletedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $uploadedBy,
        public string $fileableType,
        public int $fileableId,
        public int $fileId
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel("media:{$this->fileableType}:{$this->fileableId}");
    }

    public function broadcastWith(): array
    {
        return ['deleted_file_id' => $this->fileId];
    }

    public function broadcastAs(): string
    {
        return 'mediaFileDeleted';
    }

    public function broadcastConnections(): array
    {
        return ['redis'];
    }
}
