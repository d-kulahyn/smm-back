<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;

class RefreshSocialMediaTokenUseCase
{
    public function __construct(
        private SocialMediaAccountWriteRepositoryInterface $socialMediaAccountWriteRepository
    ) {}

    public function execute(int $accountId, string $newAccessToken, ?string $newRefreshToken = null): SocialMediaAccount
    {
        return $this->socialMediaAccountWriteRepository->refreshToken($accountId, $newAccessToken, $newRefreshToken);
    }
}
