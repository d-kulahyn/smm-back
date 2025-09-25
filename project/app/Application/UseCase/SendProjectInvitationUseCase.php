<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Infrastructure\API\DTO\CreateProjectInvitationDto;
use App\Infrastructure\API\DTO\SendProjectInvitationUseCaseDto;
use InvalidArgumentException;

readonly class SendProjectInvitationUseCase
{
    public function __construct(
        private ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private ProjectInvitationReadRepositoryInterface $invitationReadRepository,
        private ProjectMemberReadRepositoryInterface $memberReadRepository,
        private CustomerReadRepositoryInterface $customerReadRepository
    ) {}

    public function execute(SendProjectInvitationUseCaseDto $dto): ProjectInvitation
    {
        $customer = $this->customerReadRepository->findByEmail($dto->email);
        if ($customer && $this->memberReadRepository->findByProjectAndUser($dto->project_id, $customer->id)) {
            throw new InvalidArgumentException("User is already a member of this project");
        }

        if ($this->invitationReadRepository->findByEmailAndProjectId($dto->project_id, $dto->email)) {
            throw new InvalidArgumentException("An invitation has already been sent to this email");
        }

        $createDto = CreateProjectInvitationDto::create(
            projectId  : $dto->project_id,
            invitedBy  : $dto->invited_by,
            email      : $dto->email,
            role       : $dto->role,
            permissions: $dto->permissions
        );

        return $this->invitationWriteRepository->create($createDto);
    }
}
