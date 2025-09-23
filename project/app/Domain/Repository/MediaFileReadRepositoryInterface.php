<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\MediaFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MediaFileReadRepositoryInterface
{
    public function findById(int $id): ?MediaFile;

    public function findByFileable(string $fileableType, int $fileableId): Collection;

    public function findByUploadedBy(int $uploadedBy): Collection;

    public function findByType(string $fileType): Collection;

    public function findByUploadedByPaginated(int $uploadedBy, int $page = 1, int $perPage = 15): LengthAwarePaginator;

    public function findByProjectId(int $projectId): Collection;

    public function findByProjectIdPaginated(int $projectId, int $page = 1, int $perPage = 15): LengthAwarePaginator;

    public function findByTypeAndProjectId(string $fileType, int $projectId): Collection;
}
