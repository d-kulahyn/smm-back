<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\SocialMediaAccount;

interface SocialMediaAccountWriteRepositoryInterface
{
    public function create(array $data): SocialMediaAccount;

    public function update(int $id, array $data): SocialMediaAccount;

    public function delete(int $id): bool;

    public function updateTokens(int $id, string $accessToken, ?string $refreshToken = null, ?string $expiresAt = null): SocialMediaAccount;

    public function deactivateAccount(int $id): SocialMediaAccount;

    public function refreshToken(int $id, string $newAccessToken, ?string $newRefreshToken = null): SocialMediaAccount;
}
