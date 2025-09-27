<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Exception\BadRequestDomainException;
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
        $member = $this->projectMemberReadRepository->findByProjectAndUser($projectId, $userId);
        if (!$member) {
            throw new ProjectMemberNotFoundException("Member not found in project");
        }

        if ($member->isOwner()) {
            throw new BadRequestDomainException("Cannot remove project owner");
        }

        return $this->projectMemberWriteRepository->removeMember($projectId, $userId);
    }
}
