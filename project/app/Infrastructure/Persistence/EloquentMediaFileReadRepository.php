<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\MediaFile;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Models\MediaFile as MediaFileModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentMediaFileReadRepository implements MediaFileReadRepositoryInterface
{
    public function findById(int $id): ?MediaFile
    {
        $model = MediaFileModel::find($id);

        return $model ? MediaFile::from($model->toArray()) : null;
    }

    public function findByFileable(string $fileableType, int $fileableId): Collection
    {
        $models = MediaFileModel::where('fileable_type', $fileableType)
            ->where('fileable_id', $fileableId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => MediaFile::from($model->toArray()));
    }

    public function findByUploadedBy(int $uploadedBy): Collection
    {
        $models = MediaFileModel::where('uploaded_by', $uploadedBy)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => MediaFile::from($model->toArray()));
    }

    public function findByType(string $fileType): Collection
    {
        $models = MediaFileModel::where('file_type', $fileType)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => MediaFile::from($model->toArray()));
    }

    public function findByUploadedByPaginated(int $uploadedBy, int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return MediaFileModel::where('uploaded_by', $uploadedBy)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = MediaFileModel::where('fileable_type', 'App\\Models\\Project')
            ->where('fileable_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => MediaFile::from($model->toArray()));
    }

    public function findByProjectIdPaginated(int $projectId, int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return MediaFileModel::where('fileable_type', 'App\\Models\\Project')
            ->where('fileable_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByTypeAndProjectId(string $fileType, int $projectId): Collection
    {
        $models = MediaFileModel::where('fileable_type', 'App\\Models\\Project')
            ->where('fileable_id', $projectId)
            ->where('file_type', $fileType)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => MediaFile::from($model->toArray()));
    }
}
