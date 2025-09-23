<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ContentPlan;
use App\Domain\Repository\ContentPlanWriteRepositoryInterface;
use App\Models\ContentPlan as ContentPlanModel;

class EloquentContentPlanWriteRepository implements ContentPlanWriteRepositoryInterface
{
    public function create(array $data): ContentPlan
    {
        $model = ContentPlanModel::create($data);

        return ContentPlan::from($model->toArray());
    }

    public function update(int $id, array $data): ContentPlan
    {
        $model = ContentPlanModel::findOrFail($id);
        $model->update($data);

        return ContentPlan::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return ContentPlanModel::destroy($id) > 0;
    }

    public function updateStatus(int $id, string $status): ContentPlan
    {
        $model = ContentPlanModel::findOrFail($id);
        $model->update(['status' => $status]);

        return ContentPlan::from($model->fresh()->toArray());
    }

    public function scheduleContent(int $id, string $scheduledDate): ContentPlan
    {
        $model = ContentPlanModel::findOrFail($id);
        $model->update([
            'scheduled_date' => $scheduledDate,
            'status' => 'scheduled'
        ]);

        return ContentPlan::from($model->fresh()->toArray());
    }
}
