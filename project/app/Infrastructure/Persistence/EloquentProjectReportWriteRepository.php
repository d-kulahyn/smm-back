<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectReport;
use App\Domain\Repository\ProjectReportWriteRepositoryInterface;
use App\Models\ProjectReport as ProjectReportModel;

class EloquentProjectReportWriteRepository implements ProjectReportWriteRepositoryInterface
{
    public function create(array $data): ProjectReport
    {
        $model = ProjectReportModel::create($data);

        return ProjectReport::from($model->toArray());
    }

    public function update(int $id, array $data): ProjectReport
    {
        $model = ProjectReportModel::findOrFail($id);
        $model->update($data);

        return ProjectReport::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return ProjectReportModel::destroy($id) > 0;
    }

    public function markAsGenerated(int $id): ProjectReport
    {
        $model = ProjectReportModel::findOrFail($id);
        $model->update([
            'is_generated' => true,
            'generated_at' => now(),
        ]);

        return ProjectReport::from($model->fresh()->toArray());
    }

    public function updateMetrics(int $id, array $manualMetrics, array $automatedMetrics): ProjectReport
    {
        $model = ProjectReportModel::findOrFail($id);
        $model->update([
            'manual_metrics' => $manualMetrics,
            'automated_metrics' => $automatedMetrics,
        ]);

        return ProjectReport::from($model->fresh()->toArray());
    }
}
