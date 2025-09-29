<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Exception\BadRequestDomainException;
use Illuminate\Support\Facades\DB;
use App\Domain\Entity\Project;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Exception\CustomerNotFoundException;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Exception\ProjectInvitationNotFoundException;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Infrastructure\API\DTO\AcceptProjectInvitationUseCaseDto;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Enum\InvitationStatusEnum;

readonly class AcceptProjectInvitationUseCase
{
    public function __construct(
        private ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private ProjectInvitationReadRepositoryInterface $invitationReadRepository,
        private ProjectMemberWriteRepositoryInterface $memberWriteRepository,
        private CustomerReadRepositoryInterface $customerReadRepository,
        private ProjectReadRepositoryInterface $projectReadRepository,
    ) {}

    /**
     * @throws ProjectInvitationNotFoundException
     * @throws CustomerNotFoundException
     * @throws ProjectNotFoundException|BadRequestDomainException
     */
    public function execute(AcceptProjectInvitationUseCaseDto $dto): Project
    {
        if (!$this->customerReadRepository->findById([$dto->user_id])?->first()) {
            throw new CustomerNotFoundException("Customer with ID {$dto->user_id} not found");
        }

        $invitation = $this->invitationReadRepository->findByToken($dto->token);

        if (!$invitation) {
            throw new ProjectInvitationNotFoundException("Invitation not found");
        }

        $project = $this->projectReadRepository->findById($invitation->project_id);

        if (!$project) {
            throw new ProjectNotFoundException();
        }

        if (!$invitation->canBeAccepted()) {
            throw new BadRequestDomainException("Invitation cannot be accepted (expired or already processed)");
        }

        $memberData = [
            'project_id'  => $invitation->project_id,
            'user_id'     => $dto->user_id,
            'role'        => $invitation->role,
            'permissions' => $invitation->permissions,
            'joined_at'   => now(),
        ];

        DB::transaction(function () use ($invitation, $memberData) {
            $this->memberWriteRepository->create($memberData);
            $this->invitationWriteRepository->update($invitation->id, ['status' => InvitationStatusEnum::ACCEPTED->value, 'accepted_at' => now()]);
        });

        return $project;
    }
}
