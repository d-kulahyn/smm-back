<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Chat;
use App\Domain\Exception\ChatNotFoundException;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;

class MarkChatAsReadUseCase
{
    public function __construct(
        private ChatReadRepositoryInterface $chatReadRepository,
        private ChatWriteRepositoryInterface $chatWriteRepository
    ) {}

    public function execute(int $chatId): Chat
    {
        $chat = $this->chatReadRepository->findById($chatId);

        if (!$chat) {
            throw new ChatNotFoundException();
        }

        return $this->chatWriteRepository->markAsRead($chatId);
    }
}
