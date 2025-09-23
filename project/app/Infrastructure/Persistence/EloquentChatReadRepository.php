<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Chat;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use App\Models\Chat as ChatModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentChatReadRepository implements ChatReadRepositoryInterface
{
    public function findById(int $id): ?Chat
    {
        $model = ChatModel::find($id);

        return $model ? Chat::from($model->toArray()) : null;
    }

    public function findByProjectId(int $projectId, int $limit = 50): Collection
    {
        $models = ChatModel::where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $models->map(fn($model) => Chat::from($model->toArray()));
    }

    public function findByProjectIdPaginated(int $projectId, PaginationParamsDto $paramsDto): LengthAwarePaginator
    {
        return ChatModel::where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->paginate($paramsDto->perPage, ['*'], 'page', $paramsDto->page);
    }

    public function getUnreadCount(int $projectId, int $excludeCustomerId): int
    {
        return ChatModel::where('project_id', $projectId)
            ->where('customer_id', '!=', $excludeCustomerId)
            ->where('is_read', false)
            ->count();
    }

    public function findByCustomerId(int $customerId): Collection
    {
        $models = ChatModel::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => Chat::from($model->toArray()));
    }
}
