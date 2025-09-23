<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Storybook;
use Illuminate\Http\Resources\Json\JsonResource;

class StorybookResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Storybook $resource */
        $resource = $this->resource;

        return [
            'id'                 => $resource->id,
            'project_id'         => $resource->project_id,
            'title'              => $resource->title,
            'description'        => $resource->description,
            'story_type'         => $resource->story_type,
            'platform'           => $resource->platform,
            'scheduled_date'     => $resource->scheduled_date,
            'status'             => $resource->status,
            'assigned_to'        => $resource->assigned_to,
            'story_text'         => $resource->story_text,
            'stickers'           => $resource->stickers,
            'music_tracks'       => $resource->music_tracks,
            'background_color'   => $resource->background_color,
            'template_id'        => $resource->template_id,
            'duration_seconds'   => $resource->duration_seconds,
            'formatted_duration' => $resource->getFormattedDuration(),
            'is_active'          => $resource->isActive(),
            'is_expired'         => $resource->isExpired(),
            'is_draft'           => $resource->isDraft(),
            'is_video'           => $resource->isVideo(),
            'is_image'           => $resource->isImage(),
            'metadata'           => $resource->metadata,
            'created_at'         => $resource->created_at,
            'updated_at'         => $resource->updated_at,
        ];
    }
}
