<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\SocialMetric;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class SocialMetricResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var SocialMetric $resource */
        $resource = $this->resource;

        return [
            'id'                   => $resource->id,
            'project_id'           => $resource->project_id,
            'platform'             => $resource->platform,
            'metric_type'          => $resource->metric_type,
            'metric_name'          => $resource->metric_name,
            'metric_value'         => $resource->metric_value,
            'metric_date'          => $this->formatDate($resource->metric_date),
            'is_manual'            => $resource->is_manual,
            'description'          => $resource->description,
            'is_story_metric'      => $resource->isStoryMetric(),
            'is_post_metric'       => $resource->isPostMetric(),
            'is_engagement_metric' => $resource->isEngagementMetric(),
            'metadata'             => $resource->metadata,
            'created_at'           => $this->formatCreatedAt($resource->created_at),
            'updated_at'           => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
