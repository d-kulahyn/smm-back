<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\SocialMetric;
use App\Domain\Entity\PredefinedMetric;
use App\Domain\Repository\SocialMetricReadRepositoryInterface;
use App\Models\SocialMetric as SocialMetricModel;
use Illuminate\Support\Collection;

class EloquentSocialMetricReadRepository implements SocialMetricReadRepositoryInterface
{
    public function findById(int $id): ?SocialMetric
    {
        $model = SocialMetricModel::find($id);

        return $model ? SocialMetric::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->orderBy('metric_date', 'desc')
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function findByPlatform(int $projectId, string $platform): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->forPlatform($platform)
            ->orderBy('metric_date', 'desc')
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function findByMetricType(int $projectId, string $metricType): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->byType($metricType)
            ->orderBy('metric_date', 'desc')
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function findManualMetrics(int $projectId): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->manual()
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function findAutomatedMetrics(int $projectId): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->automated()
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function getMetricsForPeriod(int $projectId, string $startDate, string $endDate): Collection
    {
        $models = SocialMetricModel::where('project_id', $projectId)
            ->whereBetween('metric_date', [$startDate, $endDate])
            ->orderBy('metric_date', 'desc')
            ->get();

        return $models->map(fn($model) => SocialMetric::from($model->toArray()));
    }

    public function getPredefinedMetrics(): Collection
    {
        return collect(PredefinedMetric::getDefaultMetrics());
    }
}
