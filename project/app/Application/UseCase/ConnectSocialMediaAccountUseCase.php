<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\SocialMediaAccount;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;

class ConnectSocialMediaAccountUseCase
{
    public function __construct(
        private SocialMediaAccountWriteRepositoryInterface $socialMediaAccountWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(array $data): SocialMediaAccount
    {
        // Проверяем существование проекта
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        // Создаем подключение к социальной сети
        return $this->socialMediaAccountWriteRepository->create($data);
    }
}
