<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Project;
use App\Domain\Repository\ProjectWriteRepositoryInterface;
use App\Models\Project as ProjectModel;

class EloquentProjectWriteRepository implements ProjectWriteRepositoryInterface
{
    public function create(array $data): Project
    {
        $model = ProjectModel::create($data);

        return Project::from($model->toArray());
    }

    public function update(int $id, array $data): Project
    {
        $model = ProjectModel::findOrFail($id);
        $model->update($data);

        return Project::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return ProjectModel::destroy($id) > 0;
    }

    public function updateStatus(int $id, string $status): Project
    {
        $model = ProjectModel::findOrFail($id);
        $model->update(['status' => $status]);

        return Project::from($model->fresh()->toArray());
    }
}
