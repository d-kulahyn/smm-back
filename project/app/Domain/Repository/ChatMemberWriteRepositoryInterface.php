<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ChatMember;

interface ChatMemberWriteRepositoryInterface
{
    public function create(array $data): ChatMember;
    public function update(int $id, array $data): ChatMember;
    public function delete(int $id): bool;
    public function isUserInChat(int $chatId, int $userId): bool;
    public function removeUserFromChat(int $chatId, int $userId): bool;
    public function updateUserRole(int $chatId, int $userId, string $role, array $permissions = []): bool;
}
