<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;

class DisconnectSocialMediaAccountUseCase
{
    public function __construct(
        private SocialMediaAccountWriteRepositoryInterface $socialMediaAccountWriteRepository
    ) {}

    public function execute(int $accountId): SocialMediaAccount
    {
        return $this->socialMediaAccountWriteRepository->deactivateAccount($accountId);
    }
}
