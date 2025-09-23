<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ContentPlan;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentPlanResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var ContentPlan $resource */
        $resource = $this->resource;

        return [
            'id'                 => $resource->id,
            'project_id'         => $resource->project_id,
            'title'              => $resource->title,
            'description'        => $resource->description,
            'content_type'       => $resource->content_type,
            'platform'           => $resource->platform,
            'scheduled_date'     => $this->formatDate($resource->scheduled_date),
            'status'             => $resource->status,
            'assigned_to'        => $resource->assigned_to,
            'content_text'       => $resource->content_text,
            'hashtags'           => $resource->hashtags,
            'mentions'           => $resource->mentions,
            'link_url'           => $resource->link_url,
            'formatted_hashtags' => $resource->getFormattedHashtags(),
            'formatted_mentions' => $resource->getFormattedMentions(),
            'is_scheduled'       => $resource->isScheduled(),
            'is_published'       => $resource->isPublished(),
            'is_draft'           => $resource->isDraft(),
            'metadata'           => $resource->metadata,
            'created_at'         => $this->formatCreatedAt($resource->created_at),
            'updated_at'         => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
