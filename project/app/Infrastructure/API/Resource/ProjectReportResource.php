<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\ProjectReport;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectReportResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var ProjectReport $resource */
        $resource = $this->resource;

        return [
            'id'                => $resource->id,
            'project_id'        => $resource->project_id,
            'report_date'       => $this->formatDate($resource->report_date),
            'period_type'       => $resource->period_type,
            'manual_metrics'    => $resource->manual_metrics,
            'automated_metrics' => $resource->automated_metrics,
            'social_metrics'    => $resource->social_metrics,
            'summary_data'      => $resource->summary_data,
            'is_generated'      => $resource->is_generated,
            'generated_at'      => $this->formatDate($resource->generated_at),
            'total_reach'       => $resource->getTotalReach(),
            'total_engagement'  => $resource->getTotalEngagement(),
            'engagement_rate'   => $resource->getEngagementRate(),
            'created_at'        => $this->formatCreatedAt($resource->created_at),
            'updated_at'        => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
