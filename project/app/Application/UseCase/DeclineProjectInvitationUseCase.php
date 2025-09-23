<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Exception\ProjectInvitationNotFoundException;
use App\Infrastructure\API\DTO\DeclineProjectInvitationUseCaseDto;

class DeclineProjectInvitationUseCase
{
    public function __construct(
        private readonly ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private readonly ProjectInvitationReadRepositoryInterface $invitationReadRepository
    ) {}

    public function execute(DeclineProjectInvitationUseCaseDto $dto): ProjectInvitation
    {
        // Находим приглашение по токену
        $invitation = $this->invitationReadRepository->findByToken($dto->token);

        if (!$invitation) {
            throw new ProjectInvitationNotFoundException("Invitation not found");
        }

        if (!$invitation->isPending()) {
            throw new \InvalidArgumentException("Invitation cannot be declined (already processed)");
        }

        // Отклоняем приглашение
        $this->invitationWriteRepository->update($invitation->id, ['status' => 'declined']);

        return $this->invitationReadRepository->findById($invitation->id);
    }
}
