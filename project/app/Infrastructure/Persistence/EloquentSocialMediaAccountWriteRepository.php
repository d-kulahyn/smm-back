<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;
use App\Models\SocialMediaAccount as SocialMediaAccountModel;

class EloquentSocialMediaAccountWriteRepository implements SocialMediaAccountWriteRepositoryInterface
{
    public function create(array $data): SocialMediaAccount
    {
        $model = SocialMediaAccountModel::create($data);

        return SocialMediaAccount::from($model->toArray());
    }

    public function update(int $id, array $data): SocialMediaAccount
    {
        $model = SocialMediaAccountModel::findOrFail($id);
        $model->update($data);

        return SocialMediaAccount::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return SocialMediaAccountModel::destroy($id) > 0;
    }

    public function updateTokens(int $id, string $accessToken, ?string $refreshToken = null, ?string $expiresAt = null): SocialMediaAccount
    {
        $model = SocialMediaAccountModel::findOrFail($id);
        $model->update([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_at' => $expiresAt,
            'is_active' => true,
        ]);

        return SocialMediaAccount::from($model->fresh()->toArray());
    }

    public function deactivateAccount(int $id): SocialMediaAccount
    {
        $model = SocialMediaAccountModel::findOrFail($id);
        $model->update(['is_active' => false]);

        return SocialMediaAccount::from($model->fresh()->toArray());
    }

    public function refreshToken(int $id, string $newAccessToken, ?string $newRefreshToken = null): SocialMediaAccount
    {
        $model = SocialMediaAccountModel::findOrFail($id);
        $model->update([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
        ]);

        return SocialMediaAccount::from($model->fresh()->toArray());
    }
}
