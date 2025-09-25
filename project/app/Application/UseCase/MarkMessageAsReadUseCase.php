<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ChatWriteRepositoryInterface;

class MarkMessageAsReadUseCase
{
    public function __construct(
        private readonly ChatWriteRepositoryInterface $chatWriteRepository
    ) {}

    public function execute(int $messageId, int $customerId): void
    {
        $this->chatWriteRepository->markMessageAsRead($messageId, $customerId);
    }
}
