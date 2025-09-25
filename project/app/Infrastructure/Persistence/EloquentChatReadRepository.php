<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Chat;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use App\Infrastructure\Mapper\ChatMapper;
use App\Infrastructure\Mapper\ChatMessageMapper;
use App\Models\Chat as ChatModel;
use App\Models\ChatMessage as ChatMessageModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentChatReadRepository implements ChatReadRepositoryInterface
{
    public function __construct(
        private readonly ChatMapper $chatMapper,
        private readonly ChatMessageMapper $chatMessageMapper
    ) {}

    public function findChatById(int $id): ?Chat
    {
        $model = ChatModel::find($id);

        return $model ? $this->chatMapper->toDomain($model) : null;
    }

    public function findChatsByProjectId(int $projectId, int $limit = 50): Collection
    {
        $models = ChatModel::where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $models->map(fn($model) => $this->chatMapper->toDomain($model));
    }

    public function findChatsByProjectIdPaginated(int $projectId, PaginationParamsDto $paramsDto): LengthAwarePaginator
    {
        $paginated = ChatModel::where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->paginate($paramsDto->perPage, ['*'], 'page', $paramsDto->page);

        $paginated->through(fn($model) => $this->chatMapper->toDomain($model));

        return $paginated;
    }

    public function findMessagesByChatIdPaginated(int $chatId, object $paginationParams): LengthAwarePaginator
    {
        $paginated = ChatMessageModel::where('chat_id', $chatId)
            ->orderBy('created_at', 'desc')
            ->paginate($paginationParams->perPage, ['*'], 'page', $paginationParams->page);

        $paginated->through(fn($model) => $this->chatMessageMapper->toDomain($model));

        return $paginated;
    }

    public function getUnreadMessagesCount(int $chatId, int $userId): int
    {
        return ChatMessageModel::where('chat_id', $chatId)
            ->where('customer_id', '!=', $userId)
            ->whereDoesntHave('reads', function ($query) use ($userId) {
                $query->where('customer_id', $userId);
            })
            ->count();
    }

    public function getUnreadMessagesCountForProject(int $projectId, int $excludeCustomerId): int
    {
        return ChatMessageModel::where('project_id', $projectId)
            ->where('customer_id', '!=', $excludeCustomerId)
            ->whereDoesntHave('reads', function ($query) use ($excludeCustomerId) {
                $query->where('customer_id', $excludeCustomerId);
            })
            ->count();
    }

    public function findChatsByCustomerId(int $customerId): Collection
    {
        $models = ChatModel::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->chatMapper->toDomain($model));
    }
}
