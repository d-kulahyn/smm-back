<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Customer;
use App\Domain\Entity\ProjectInvitation;
use App\Domain\Exception\BadRequestDomainException;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Infrastructure\API\DTO\CreateProjectInvitationDto;
use App\Infrastructure\API\DTO\SendProjectInvitationUseCaseDto;

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
        /** @var ?Customer $customer */
        $customer = $this->customerReadRepository->findById([$dto->invited_user_id])->first();
        if ($customer && $this->memberReadRepository->findByProjectAndUser($dto->project_id, $customer->id)) {
            throw new BadRequestDomainException("User is already a member of this project");
        }

        if (!empty($this->invitationReadRepository->findPendingInvitationByUserIdAndProjectId(
            $dto->project_id,
            $dto->invited_user_id
        ))) {
            throw new BadRequestDomainException("An invitation has already been sent to this user");
        }

        $createDto = CreateProjectInvitationDto::create(
            projectId      : $dto->project_id,
            invitedBy      : $dto->invited_by,
            invited_user_id: $dto->invited_user_id,
            role           : $dto->role,
            permissions    : $dto->permissions
        );

        return $this->invitationWriteRepository->create($createDto);
    }
}
