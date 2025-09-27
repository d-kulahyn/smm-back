<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Exception\ProjectMemberNotFoundException;

readonly class UpdateProjectMemberUseCase
{
    public function __construct(
        private ProjectMemberWriteRepositoryInterface $projectMemberWriteRepository,
        private ProjectMemberReadRepositoryInterface $projectMemberReadRepository
    ) {}

    /**
     * @throws ProjectMemberNotFoundException
     */
    public function execute(int $projectId, int $userId, ?string $role = null, ?array $permissions = null): ProjectMember
    {
        $member = $this->projectMemberReadRepository->findByProjectAndUser($projectId, $userId);
        if (!$member) {
            throw new ProjectMemberNotFoundException();
        }

        if ($role !== null) {
            $member = $this->projectMemberWriteRepository->updateRole($projectId, $userId, $role);
        }

        if ($permissions !== null) {
            $member = $this->projectMemberWriteRepository->updatePermissions($projectId, $userId, $permissions);
        }

        return $member;
    }
}
