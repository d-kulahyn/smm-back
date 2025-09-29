<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectMember;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Exception\CustomerNotFoundException;

readonly class AddProjectMemberUseCase
{
    public function __construct(
        private ProjectMemberWriteRepositoryInterface $projectMemberWriteRepository,
        private ProjectMemberReadRepositoryInterface $projectMemberReadRepository,
        private ProjectReadRepositoryInterface $projectReadRepository,
        private CustomerReadRepositoryInterface $customerReadRepository
    ) {}

    /**
     * @throws ProjectNotFoundException
     * @throws CustomerNotFoundException
     */
    public function execute(int $projectId, int $userId, string $role, array $permissions = []): ProjectMember
    {
        $project = $this->projectReadRepository->findById($projectId);
        if (!$project) {
            throw new ProjectNotFoundException();
        }

        $user = $this->customerReadRepository->findById([$userId])->first();
        if (!$user) {
            throw new CustomerNotFoundException();
        }

        if ($member = $this->projectMemberReadRepository->findByProjectAndUserId($projectId, $userId)) {
            return $member;
        }

        return $this->projectMemberWriteRepository->addMember($projectId, $userId, $role, $permissions);
    }
}
