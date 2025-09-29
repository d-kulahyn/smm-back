<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ChatMemberWriteRepositoryInterface;
use App\Infrastructure\API\DTO\RemoveUserFromChatDto;

readonly class RemoveUserFromChatUseCase
{
    public function __construct(
        private ChatMemberWriteRepositoryInterface $chatMemberWriteRepository,
    ) {}

    public function execute(int $chatId, RemoveUserFromChatDto $dto): bool
    {
        if (!$this->chatMemberWriteRepository->isUserInChat($chatId, $dto->user_id)) {
            throw new \InvalidArgumentException("User is not a member of this chat");
        }

        return $this->chatMemberWriteRepository->removeUserFromChat($chatId, $dto->user_id);
    }
}
