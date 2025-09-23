<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\MediaFile;
use App\Domain\Repository\MediaFileWriteRepositoryInterface;
use App\Models\MediaFile as MediaFileModel;

class EloquentMediaFileWriteRepository implements MediaFileWriteRepositoryInterface
{
    public function create(array $data): MediaFile
    {
        $model = MediaFileModel::create($data);

        return MediaFile::from($model->toArray());
    }

    public function update(int $id, array $data): MediaFile
    {
        $model = MediaFileModel::findOrFail($id);
        $model->update($data);

        return MediaFile::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return MediaFileModel::destroy($id) > 0;
    }

    public function save(MediaFile $mediaFile): MediaFile
    {
        $data = $mediaFile->toArray();

        if (isset($data['id'])) {
            $model = MediaFileModel::findOrFail($data['id']);
            $model->update($data);
        } else {
            $model = MediaFileModel::create($data);
        }

        return MediaFile::from($model->fresh()->toArray());
    }
}
