<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Exception\CustomerNotFoundException;

class AddProjectMemberUseCase
{
    public function __construct(
        private readonly ProjectMemberWriteRepositoryInterface $projectMemberWriteRepository,
        private readonly ProjectReadRepositoryInterface $projectReadRepository,
        private readonly CustomerReadRepositoryInterface $customerReadRepository
    ) {}

    public function execute(int $projectId, int $userId, string $role, array $permissions = []): ProjectMember
    {
        // Проверяем, что проект существует
        $project = $this->projectReadRepository->findById($projectId);
        if (!$project) {
            throw new ProjectNotFoundException("Project with ID {$projectId} not found");
        }

        // Проверяем, что пользователь существует
        $user = $this->customerReadRepository->findById($userId);
        if (!$user) {
            throw new CustomerNotFoundException("User with ID {$userId} not found");
        }

        // Добавляем участника в проект
        return $this->projectMemberWriteRepository->addMember($projectId, $userId, $role, $permissions);
    }
}
