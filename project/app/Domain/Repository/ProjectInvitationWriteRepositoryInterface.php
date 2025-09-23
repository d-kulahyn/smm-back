<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectInvitation;

interface ProjectInvitationWriteRepositoryInterface
{
    public function create(array $data): ProjectInvitation;

    public function update(int $id, array $data): ProjectInvitation;

    public function delete(int $id): bool;

    public function acceptInvitation(string $token, int $userId): ProjectInvitation;

    public function declineInvitation(string $token): ProjectInvitation;

    public function markAsExpired(int $id): ProjectInvitation;

    public function markExpiredInvitations(): int;
}
