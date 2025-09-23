<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Chat;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;

interface ChatWriteRepositoryInterface
{
    public function create(VoiceMessageUseCaseDto $data): Chat;

    public function markAsRead(int $id): Chat;

    public function markAllAsReadForProject(int $projectId, int $excludeCustomerId): int;

    public function delete(int $id): bool;
}
