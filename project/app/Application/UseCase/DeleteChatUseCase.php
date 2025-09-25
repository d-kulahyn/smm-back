<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ChatWriteRepositoryInterface;

readonly class DeleteChatUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository
    ) {}

    public function execute(int $chatId): bool
    {
        return $this->chatWriteRepository->deleteChat($chatId);
    }
}
