<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Domain\Entity\ChatMember;
use App\Domain\Entity\Customer;
use App\Models\ChatMember as EloquentChatMember;

class ChatMemberMapper
{
    public function toDomain(EloquentChatMember $eloquentChatMember): ChatMember
    {
        return new ChatMember(
            id         : $eloquentChatMember->id,
            chat_id    : $eloquentChatMember->chat_id,
            user_id    : $eloquentChatMember->user_id,
            joined_at  : $eloquentChatMember->joined_at?->toISOString(),
            created_at : $eloquentChatMember->created_at?->toISOString(),
            updated_at : $eloquentChatMember->updated_at?->toISOString(),
            user       : $eloquentChatMember->user ? Customer::from($eloquentChatMember->user->toArray()) : null,
        );
    }

    public function toEloquent(ChatMember $chatMember): array
    {
        return [
            'id'       => $chatMember->id,
            'chat_id'  => $chatMember->chat_id,
            'user_id'  => $chatMember->user_id,
            'joined_at' => $chatMember->joined_at,
        ];
    }
}
