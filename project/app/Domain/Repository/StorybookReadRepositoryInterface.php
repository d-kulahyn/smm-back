<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Storybook;
use Illuminate\Support\Collection;

interface StorybookReadRepositoryInterface
{
    public function findById(int $id): ?Storybook;

    public function findByProjectId(int $projectId): Collection;

    public function findByStatus(string $status): Collection;

    public function findByPlatform(string $platform): Collection;

    public function findActiveStories(): Collection;

    public function findByAssignedTo(int $customerId): Collection;

    public function findExpiredStories(): Collection;
}
