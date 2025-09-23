<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\SocialMediaAccount;
use Illuminate\Support\Collection;

interface SocialMediaAccountReadRepositoryInterface
{
    public function findById(int $id): ?SocialMediaAccount;

    public function findByProjectId(int $projectId): Collection;

    public function findByPlatform(string $platform): Collection;

    public function findActiveAccounts(int $projectId): Collection;

    public function findExpiredTokens(): Collection;

    public function findByProjectAndPlatform(int $projectId, string $platform): Collection;

    public function getConnectedPlatforms(int $projectId): array;
}
