<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Domain\Entity\Chat;
use App\Domain\Entity\Customer;
use App\Domain\Entity\Project;
use App\Models\Chat as EloquentChat;

class ChatMapper
{
    public function __construct(
        private readonly ChatMemberMapper $chatMemberMapper
    ) {}

    public function toDomain(EloquentChat $eloquentChat): Chat
    {
        $members = null;
        if ($eloquentChat->relationLoaded('members')) {
            $members = $eloquentChat->members->map(fn($member) => $this->chatMemberMapper->toDomain($member))->all();
        }

        return new Chat(
            id                   : $eloquentChat->id,
            project_id           : $eloquentChat->project_id,
            customer_id          : $eloquentChat->customer_id,
            title                : $eloquentChat->title,
            description          : $eloquentChat->description,
            status               : $eloquentChat->status,
            created_at           : $eloquentChat->created_at?->toISOString(),
            updated_at           : $eloquentChat->updated_at?->toISOString(),
            unread_messages_count: $eloquentChat->unreadMessagesCount(request()->user()->id),
            customer             : $eloquentChat->customer ? Customer::from($eloquentChat->customer->toArray()) : null,
            project              : $eloquentChat->project ? Project::from($eloquentChat->project->toArray()) : null,
            members              : $members
        );
    }

    public function toEloquent(Chat $chat): array
    {
        return [
            'id'          => $chat->id,
            'project_id'  => $chat->project_id,
            'customer_id' => $chat->customer_id,
            'title'       => $chat->title,
            'description' => $chat->description,
            'status'      => $chat->status,
        ];
    }
}
