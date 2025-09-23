<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\MediaFile;

interface MediaFileWriteRepositoryInterface
{
    public function create(array $data): MediaFile;

    public function update(int $id, array $data): MediaFile;

    public function delete(int $id): bool;

    public function save(MediaFile $mediaFile): MediaFile;
}
