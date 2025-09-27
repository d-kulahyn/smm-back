<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;

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

        $this->invitationWriteRepository->update($invitation->id, ['status' => 'declined', 'decided_at' => now()]);
    }
}
