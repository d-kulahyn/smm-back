<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ContentPlan;
use App\Domain\Repository\ContentPlanReadRepositoryInterface;
use App\Models\ContentPlan as ContentPlanModel;
use Illuminate\Support\Collection;

class EloquentContentPlanReadRepository implements ContentPlanReadRepositoryInterface
{
    public function findById(int $id): ?ContentPlan
    {
        $model = ContentPlanModel::find($id);

        return $model ? ContentPlan::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = ContentPlanModel::where('project_id', $projectId)
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }

    public function findByStatus(string $status): Collection
    {
        $models = ContentPlanModel::where('status', $status)->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }

    public function findByPlatform(string $platform): Collection
    {
        $models = ContentPlanModel::where('platform', $platform)->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }

    public function findScheduledForDate(string $date): Collection
    {
        $models = ContentPlanModel::whereDate('scheduled_date', $date)
            ->where('status', 'scheduled')
            ->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }

    public function findByAssignedTo(int $customerId): Collection
    {
        $models = ContentPlanModel::where('assigned_to', $customerId)
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }

    public function getContentCalendar(int $projectId, string $startDate, string $endDate): Collection
    {
        $models = ContentPlanModel::where('project_id', $projectId)
            ->whereBetween('scheduled_date', [$startDate, $endDate])
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return $models->map(fn($model) => ContentPlan::from($model->toArray()));
    }
}
