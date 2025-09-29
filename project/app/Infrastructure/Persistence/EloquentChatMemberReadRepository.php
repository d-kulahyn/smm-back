<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ChatMember;
use App\Domain\Repository\ChatMemberReadRepositoryInterface;
use App\Models\ChatMember as ChatMemberModel;

readonly class EloquentChatMemberReadRepository implements ChatMemberReadRepositoryInterface
{
    public function findById(int $id): ?ChatMember
    {
        $model = ChatMemberModel::with(['user', 'chat'])->find($id);

        return $model ? ChatMember::from($model->toArray()) : null;
    }

    public function findByChatId(int $chatId): array
    {
        $members = ChatMemberModel::with(['user', 'chat'])
            ->where('chat_id', $chatId)
            ->orderBy('joined_at', 'desc')
            ->get();

        return $members->map(fn($member) => ChatMember::from($member->toArray()))->toArray();
    }

    public function findByUserId(int $userId): array
    {
        $members = ChatMemberModel::with(['user', 'chat'])
            ->where('user_id', $userId)
            ->orderBy('joined_at', 'desc')
            ->get();

        return $members->map(fn($member) => ChatMember::from($member->toArray()))->toArray();
    }

    public function isUserInChat(int $chatId, int $userId): bool
    {
        return ChatMemberModel::where('chat_id', $chatId)
            ->where('user_id', $userId)
            ->exists();
    }
}
