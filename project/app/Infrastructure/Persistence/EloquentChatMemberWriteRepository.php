<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ChatMember;
use App\Models\ChatMember as ChatMemberModel;
use App\Domain\Repository\ChatMemberWriteRepositoryInterface;

readonly class EloquentChatMemberWriteRepository implements ChatMemberWriteRepositoryInterface
{
    public function create(array $data): ChatMember
    {
        $model = ChatMemberModel::create($data);
        $model->load(['user', 'chat']);

        return ChatMember::from($model->toArray());
    }

    public function update(int $id, array $data): ChatMember
    {
        $model = ChatMemberModel::findOrFail($id);
        $model->update($data);
        $model->load(['user', 'chat']);

        return ChatMember::from($model->fresh()->toArray());
    }

    public function delete(int $id): bool
    {
        return ChatMemberModel::destroy($id) > 0;
    }

    public function isUserInChat(int $chatId, int $userId): bool
    {
        return ChatMemberModel::where('chat_id', $chatId)
            ->where('user_id', $userId)
            ->exists();
    }

    public function removeUserFromChat(int $chatId, int $userId): bool
    {
        return ChatMemberModel::where('chat_id', $chatId)
            ->where('user_id', $userId)
            ->delete() > 0;
    }

    public function updateUserRole(int $chatId, int $userId, string $role, array $permissions = []): bool
    {
        return ChatMemberModel::where('chat_id', $chatId)
            ->where('user_id', $userId)
            ->update([
                'role' => $role,
                'permissions' => $permissions,
            ]) > 0;
    }
}
