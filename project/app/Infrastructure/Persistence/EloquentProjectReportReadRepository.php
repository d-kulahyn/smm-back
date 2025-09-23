<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectReport;
use App\Domain\Repository\ProjectReportReadRepositoryInterface;
use App\Models\ProjectReport as ProjectReportModel;
use Illuminate\Support\Collection;

class EloquentProjectReportReadRepository implements ProjectReportReadRepositoryInterface
{
    public function findById(int $id): ?ProjectReport
    {
        $model = ProjectReportModel::find($id);

        return $model ? ProjectReport::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = ProjectReportModel::where('project_id', $projectId)
            ->orderBy('report_date', 'desc')
            ->get();

        return $models->map(fn($model) => ProjectReport::from($model->toArray()));
    }

    public function findByPeriod(int $projectId, string $startDate, string $endDate): Collection
    {
        $models = ProjectReportModel::where('project_id', $projectId)
            ->forPeriod($startDate, $endDate)
            ->orderBy('report_date', 'desc')
            ->get();

        return $models->map(fn($model) => ProjectReport::from($model->toArray()));
    }

    public function findByPeriodType(int $projectId, string $periodType): Collection
    {
        $models = ProjectReportModel::where('project_id', $projectId)
            ->byPeriodType($periodType)
            ->orderBy('report_date', 'desc')
            ->get();

        return $models->map(fn($model) => ProjectReport::from($model->toArray()));
    }

    public function getLatestReport(int $projectId): ?ProjectReport
    {
        $model = ProjectReportModel::where('project_id', $projectId)
            ->orderBy('report_date', 'desc')
            ->first();

        return $model ? ProjectReport::from($model->toArray()) : null;
    }

    public function getGeneratedReports(int $projectId): Collection
    {
        $models = ProjectReportModel::where('project_id', $projectId)
            ->where('is_generated', true)
            ->orderBy('report_date', 'desc')
            ->get();

        return $models->map(fn($model) => ProjectReport::from($model->toArray()));
    }
}
