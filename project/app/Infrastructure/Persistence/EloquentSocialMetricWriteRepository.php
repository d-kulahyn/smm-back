<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\SocialMetric;
use App\Domain\Repository\SocialMetricWriteRepositoryInterface;
use App\Models\SocialMetric as SocialMetricModel;
use Illuminate\Support\Collection;

class EloquentSocialMetricWriteRepository implements SocialMetricWriteRepositoryInterface
{
    public function create(array $data): SocialMetric
    {
        $model = SocialMetricModel::create($data);

        return SocialMetric::from($model->toArray());
    }

    public function update(int $id, array $data): SocialMetric
    {
        $model = SocialMetricModel::findOrFail($id);
        $model->update($data);

        return SocialMetric::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return SocialMetricModel::destroy($id) > 0;
    }

    public function createBulk(array $metrics): Collection
    {
        $createdMetrics = collect();

        foreach ($metrics as $metricData) {
            $model = SocialMetricModel::create($metricData);
            $createdMetrics->push(SocialMetric::from($model->toArray()));
        }

        return $createdMetrics;
    }

    public function updateMetricValue(int $id, int $newValue): SocialMetric
    {
        $model = SocialMetricModel::findOrFail($id);
        $model->update(['metric_value' => $newValue]);

        return SocialMetric::from($model->fresh()->toArray());
    }
}
