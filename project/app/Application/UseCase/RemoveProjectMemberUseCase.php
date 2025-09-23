<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Exception\ProjectMemberNotFoundException;

class RemoveProjectMemberUseCase
{
    public function __construct(
        private readonly ProjectMemberWriteRepositoryInterface $projectMemberWriteRepository,
        private readonly ProjectMemberReadRepositoryInterface $projectMemberReadRepository
    ) {}

    public function execute(int $projectId, int $userId): bool
    {
        // Проверяем, что участник существует
        $member = $this->projectMemberReadRepository->findByProjectAndUser($projectId, $userId);
        if (!$member) {
            throw new ProjectMemberNotFoundException("Member not found in project");
        }

        // Нельзя удалить владельца проекта
        if ($member->isOwner()) {
            throw new \InvalidArgumentException("Cannot remove project owner");
        }

        return $this->projectMemberWriteRepository->removeMember($projectId, $userId);
    }
}
