<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Domain\Entity\ChatMessage;
use App\Domain\Entity\Chat;
use App\Domain\Entity\Customer;
use App\Domain\Entity\Project;
use App\Models\ChatMessage as EloquentChatMessage;

class ChatMessageMapper
{
    public function toDomain(EloquentChatMessage $eloquentMessage): ChatMessage
    {
        return new ChatMessage(
            id          : $eloquentMessage->id,
            chat_id     : $eloquentMessage->chat_id,
            project_id  : $eloquentMessage->project_id,
            customer_id : $eloquentMessage->customer_id,
            message     : $eloquentMessage->message,
            message_type: $eloquentMessage->message_type,
            sender_type : $eloquentMessage->sender_type,
            file_path   : $eloquentMessage->file_path,
            file_name   : $eloquentMessage->file_name,
            file_size   : $eloquentMessage->file_size,
            metadata    : $eloquentMessage->metadata,
            created_at  : $eloquentMessage->created_at?->toISOString(),
            updated_at  : $eloquentMessage->updated_at?->toISOString(),
            chat        : $eloquentMessage->chat ? Chat::from($eloquentMessage->chat->toArray()) : null,
            customer    : $eloquentMessage->customer ? Customer::from($eloquentMessage->customer->toArray()) : null,
            project     : $eloquentMessage->project ? Project::from($eloquentMessage->project->toArray()) : null
        );
    }

    public function toEloquent(ChatMessage $message): array
    {
        return [
            'id'           => $message->id,
            'chat_id'      => $message->chat_id,
            'project_id'   => $message->project_id,
            'customer_id'  => $message->customer_id,
            'message'      => $message->message,
            'message_type' => $message->message_type,
            'sender_type'  => $message->sender_type,
            'file_path'    => $message->file_path,
            'file_name'    => $message->file_name,
            'file_size'    => $message->file_size,
            'metadata'     => $message->metadata,
        ];
    }
}
