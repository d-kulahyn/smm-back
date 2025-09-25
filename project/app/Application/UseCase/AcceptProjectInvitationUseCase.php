<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Customer;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Exception\ProjectInvitationNotFoundException;
use App\Infrastructure\API\DTO\AcceptProjectInvitationUseCaseDto;

readonly class AcceptProjectInvitationUseCase
{
    public function __construct(
        private ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private ProjectInvitationReadRepositoryInterface $invitationReadRepository,
        private ProjectMemberWriteRepositoryInterface $memberWriteRepository,
        private CustomerReadRepositoryInterface $customerReadRepository
    ) {}

    public function execute(AcceptProjectInvitationUseCaseDto $dto): Customer
    {
        $invitation = $this->invitationReadRepository->findByToken($dto->token);

        if (!$invitation) {
            throw new ProjectInvitationNotFoundException("Invitation not found");
        }

        if (!$invitation->canBeAccepted()) {
            throw new \InvalidArgumentException("Invitation cannot be accepted (expired or already processed)");
        }

        $memberData = [
            'project_id' => $invitation->project_id,
            'user_id' => $dto->user_id,
            'role' => $invitation->role,
            'permissions' => $invitation->permissions,
            'joined_at' => now()
        ];

        $this->memberWriteRepository->create($memberData);

        $this->invitationWriteRepository->update($invitation->id, ['status' => 'accepted']);

        /** @var Customer $customer */
        $customer = $this->customerReadRepository->findById([$dto->user_id])?->first();

        if (!$customer) {
            throw new \App\Domain\Exception\CustomerNotFoundException("Customer with ID {$dto->user_id} not found");
        }

        return $customer;
    }
}
