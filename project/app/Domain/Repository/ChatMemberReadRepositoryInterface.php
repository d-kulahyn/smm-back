<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ChatMember;

interface ChatMemberReadRepositoryInterface
{
    public function findById(int $id): ?ChatMember;
    public function findByChatId(int $chatId): array;
    public function findByUserId(int $userId): array;
    public function isUserInChat(int $chatId, int $userId): bool;
}
