<?php

namespace App\Domain\Event;

use App\Domain\Entity\Project;
use App\Infrastructure\API\Resource\MediaFileResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MediaFileUploadedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $initiatorId,
        public MediaFileResource $mediaFile,
        protected Project $project,
    ) {}

    public function broadcastAs(): string
    {
        return 'mediaFileUploaded';
    }

    public function broadcastConnections(): array
    {
        return ['stream'];
    }

    public function broadcastOn(): array
    {
        $channels = [];

        foreach ($this->project->members as $member) {
            if ($member->user_id === $this->initiatorId) {
                continue;
            }
            $channels[] = new Channel("projects.{$this->project->id}.members.{$member->user_id}");
        }

        return $channels;
    }
}
