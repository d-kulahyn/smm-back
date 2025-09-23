<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Storybook;
use App\Domain\Repository\StorybookReadRepositoryInterface;
use App\Models\Storybook as StorybookModel;
use Illuminate\Support\Collection;

class EloquentStorybookReadRepository implements StorybookReadRepositoryInterface
{
    public function findById(int $id): ?Storybook
    {
        $model = StorybookModel::find($id);

        return $model ? Storybook::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = StorybookModel::where('project_id', $projectId)
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }

    public function findByStatus(string $status): Collection
    {
        $models = StorybookModel::where('status', $status)->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }

    public function findByPlatform(string $platform): Collection
    {
        $models = StorybookModel::where('platform', $platform)->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }

    public function findActiveStories(): Collection
    {
        $models = StorybookModel::where('status', 'active')
            ->where('scheduled_date', '>', now()->subDay())
            ->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }

    public function findByAssignedTo(int $customerId): Collection
    {
        $models = StorybookModel::where('assigned_to', $customerId)
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }

    public function findExpiredStories(): Collection
    {
        $models = StorybookModel::where('status', 'active')
            ->where('scheduled_date', '<', now()->subDay())
            ->get();

        return $models->map(fn($model) => Storybook::from($model->toArray()));
    }
}
