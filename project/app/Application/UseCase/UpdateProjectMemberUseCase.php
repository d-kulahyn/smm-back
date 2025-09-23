<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Exception\ProjectMemberNotFoundException;

class UpdateProjectMemberUseCase
{
    public function __construct(
        private readonly ProjectMemberWriteRepositoryInterface $projectMemberWriteRepository,
        private readonly ProjectMemberReadRepositoryInterface $projectMemberReadRepository
    ) {}

    public function execute(int $projectId, int $userId, ?string $role = null, ?array $permissions = null): ProjectMember
    {
        // Проверяем, что участник существует
        $member = $this->projectMemberReadRepository->findByProjectAndUser($projectId, $userId);
        if (!$member) {
            throw new ProjectMemberNotFoundException("Member not found in project");
        }

        // Обновляем роль, если указана
        if ($role !== null) {
            $member = $this->projectMemberWriteRepository->updateRole($projectId, $userId, $role);
        }

        // Обновляем права, если указаны
        if ($permissions !== null) {
            $member = $this->projectMemberWriteRepository->updatePermissions($projectId, $userId, $permissions);
        }

        return $member;
    }
}
