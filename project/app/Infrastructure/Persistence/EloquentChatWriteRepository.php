<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Chat;
use App\Domain\Entity\ChatMessage;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use App\Infrastructure\API\DTO\CreateChatDto;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\Persistence\Mapper\ChatMapper;
use App\Infrastructure\Persistence\Mapper\ChatMessageMapper;
use App\Models\Chat as ChatModel;
use App\Models\ChatMessage as ChatMessageModel;
use App\Models\ChatMessageRead;

readonly class EloquentChatWriteRepository implements ChatWriteRepositoryInterface
{
    public function __construct(
        private ChatMapper $chatMapper,
        private ChatMessageMapper $chatMessageMapper
    ) {}

    public function createVoiceMessage(VoiceMessageUseCaseDto $data): ChatMessage
    {
        $model = ChatMessageModel::create($data->toArray());

        return $this->chatMessageMapper->toDomain($model);
    }

    public function createTextMessage(TextMessageUseCaseDto $data): ChatMessage
    {
        $model = ChatMessageModel::create($data->toArray());

        return $this->chatMessageMapper->toDomain($model);
    }

    public function createChat(CreateChatDto $data): Chat
    {
        $model = ChatModel::create([
            'project_id'  => $data->project_id,
            'customer_id' => $data->customer_id,
            'title'       => $data->title,
            'description' => $data->description,
            'status'      => $data->status ?? 'active',
        ]);

        return $this->chatMapper->toDomain($model);
    }

    public function updateChat(int $chatId, array $data): Chat
    {
        $model = ChatModel::findOrFail($chatId);
        $model->update($data);

        return $this->chatMapper->toDomain($model->fresh());
    }

    public function markAsRead(int $chatId): Chat
    {
        $model = ChatModel::findOrFail($chatId);

        return $this->chatMapper->toDomain($model);
    }

    public function markMessagesAsRead(array $ids, int $customerId): void
    {
        $reads = [];
        $now = now();

        foreach ($ids as $messageId) {
            $reads[] = [
                'chat_message_id' => $messageId,
                'customer_id'     => $customerId,
                'read_at'         => $now,
            ];
        }

        if (!empty($reads)) {
            ChatMessageRead::insert($reads);
        }
    }

    public function markAllMessagesAsReadForProject(int $projectId, int $excludeCustomerId): int
    {
        $messageIds = ChatMessageModel::where('project_id', $projectId)
            ->where('customer_id', '!=', $excludeCustomerId)
            ->whereDoesntHave('reads', function ($query) use ($excludeCustomerId) {
                $query->where('customer_id', $excludeCustomerId);
            })
            ->pluck('id');

        $reads = [];
        $now = now();

        foreach ($messageIds as $messageId) {
            $reads[] = [
                'chat_message_id' => $messageId,
                'customer_id'     => $excludeCustomerId,
                'read_at'         => $now,
                'created_at'      => $now,
                'updated_at'      => $now,
            ];
        }

        if (!empty($reads)) {
            ChatMessageRead::insert($reads);
        }

        return count($reads);
    }

    public function deleteChat(int $chatId): bool
    {
        return ChatModel::destroy($chatId) > 0;
    }
}
