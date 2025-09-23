<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Repository\SocialMediaAccountReadRepositoryInterface;
use App\Models\SocialMediaAccount as SocialMediaAccountModel;
use Illuminate\Support\Collection;

class EloquentSocialMediaAccountReadRepository implements SocialMediaAccountReadRepositoryInterface
{
    public function findById(int $id): ?SocialMediaAccount
    {
        $model = SocialMediaAccountModel::find($id);

        return $model ? SocialMediaAccount::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId): Collection
    {
        $models = SocialMediaAccountModel::where('project_id', $projectId)
            ->orderBy('platform')
            ->get();

        return $models->map(fn($model) => SocialMediaAccount::from($model->toArray()));
    }

    public function findByPlatform(string $platform): Collection
    {
        $models = SocialMediaAccountModel::where('platform', $platform)
            ->where('is_active', true)
            ->get();

        return $models->map(fn($model) => SocialMediaAccount::from($model->toArray()));
    }

    public function findActiveAccounts(int $projectId): Collection
    {
        $models = SocialMediaAccountModel::where('project_id', $projectId)
            ->where('is_active', true)
            ->get();

        return $models->map(fn($model) => SocialMediaAccount::from($model->toArray()));
    }

    public function findExpiredTokens(): Collection
    {
        $models = SocialMediaAccountModel::where('expires_at', '<', now())
            ->where('is_active', true)
            ->get();

        return $models->map(fn($model) => SocialMediaAccount::from($model->toArray()));
    }

    public function findByProjectAndPlatform(int $projectId, string $platform): Collection
    {
        $models = SocialMediaAccountModel::where('project_id', $projectId)
            ->where('platform', $platform)
            ->get();

        return $models->map(fn($model) => SocialMediaAccount::from($model->toArray()));
    }

    public function getConnectedPlatforms(int $projectId): array
    {
        return SocialMediaAccountModel::where('project_id', $projectId)
            ->where('is_active', true)
            ->pluck('platform')
            ->unique()
            ->values()
            ->toArray();
    }
}
