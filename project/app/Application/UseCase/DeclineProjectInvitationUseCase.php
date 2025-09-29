<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Enum\InvitationStatusEnum;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;

readonly class DeclineProjectInvitationUseCase
{
    public function __construct(
        private ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private ProjectInvitationReadRepositoryInterface $invitationReadRepository
    ) {}

    public function execute(string $token): void
    {
        $invitation = $this->invitationReadRepository->findByToken($token);

        if (!$invitation->isPending()) {
            throw new \InvalidArgumentException("Invitation cannot be declined (already processed)");
        }

        $this->invitationWriteRepository->update($invitation->id, ['status' => InvitationStatusEnum::DECLINED->value, 'decided_at' => now()]);
    }
}
