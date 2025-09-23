<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Chat;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use App\Models\Chat as ChatModel;

class EloquentChatWriteRepository implements ChatWriteRepositoryInterface
{
    public function create(VoiceMessageUseCaseDto $data): Chat
    {
        $model = ChatModel::create($data->toArray());

        return Chat::from($model->toArray());
    }

    public function markAsRead(int $id): Chat
    {
        $model = ChatModel::findOrFail($id);
        $model->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return Chat::from($model->fresh()->toArray());
    }

    public function markAllAsReadForProject(int $projectId, int $excludeCustomerId): int
    {
        return ChatModel::where('project_id', $projectId)
            ->where('customer_id', '!=', $excludeCustomerId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function delete(int $id): bool
    {
        return ChatModel::destroy($id) > 0;
    }
}
