<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ChatWriteRepositoryInterface;

readonly class MarkAllMessagesAsReadUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository
    ) {}

    public function execute(int $projectId, int $excludeCustomerId): int
    {
        return $this->chatWriteRepository->markAllMessagesAsReadForProject($projectId, $excludeCustomerId);
    }
}
