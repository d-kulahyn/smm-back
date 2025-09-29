<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ChatMemberReadRepositoryInterface;

readonly class GetChatMembersUseCase
{
    public function __construct(
        private ChatMemberReadRepositoryInterface $chatMemberReadRepository,
    ) {}

    public function execute(int $chatId): array
    {
        return $this->chatMemberReadRepository->findByChatId($chatId);
    }
}
