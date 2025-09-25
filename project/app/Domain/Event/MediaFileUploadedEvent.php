<?php

namespace App\Domain\Event;

use App\Domain\Entity\MediaFile;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\MediaFileResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MediaFileUploadedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MediaFile $mediaFile
    ) {}

    public function broadcastWith(): array
    {
        return ['media_file' => new MediaFileResource($this->mediaFile)];
    }

    public function broadcastAs(): string
    {
        return 'mediaFileUploaded';
    }

    public function broadcastConnections(): array
    {
        return ['redis'];
    }

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_ALL_MEDIA;
    }

    protected function getProjectId(): ?int
    {
        return null;
    }

    public function broadcastOn(): array
    {
        return ["projects.{$this->mediaFile->uploaded_by}"];
    }
}
