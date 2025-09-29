<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Storybook;
use App\Domain\Enum\StorybookStatusEnum;
use App\Domain\Repository\StorybookWriteRepositoryInterface;
use App\Models\Storybook as StorybookModel;

class EloquentStorybookWriteRepository implements StorybookWriteRepositoryInterface
{
    public function create(array $data): Storybook
    {
        $model = StorybookModel::create($data);

        return Storybook::from($model->toArray());
    }

    public function update(int $id, array $data): Storybook
    {
        $model = StorybookModel::findOrFail($id);
        $model->update($data);

        return Storybook::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return StorybookModel::destroy($id) > 0;
    }

    public function updateStatus(int $id, string $status): Storybook
    {
        $model = StorybookModel::findOrFail($id);
        $model->update(['status' => $status]);

        return Storybook::from($model->fresh()->toArray());
    }

    public function markAsExpired(int $id): bool
    {
        $model = Storybook::find($id);

        if (!$model) {
            return false;
        }

        $model->update(['status' => StorybookStatusEnum::EXPIRED->value]);

        return true;
    }

    public function activateStory(int $id): Storybook
    {
        $model = StorybookModel::findOrFail($id);
        $model->update(['status' => StorybookStatusEnum::ACTIVE->value]);

        return Storybook::from($model->fresh()->toArray());
    }
}
