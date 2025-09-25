<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Chat;
use App\Domain\Entity\ChatMessage;
use App\Infrastructure\API\DTO\PaginationParamsDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ChatReadRepositoryInterface
{
    public function findChatById(int $id): ?Chat;

    public function findChatsByProjectId(int $projectId, int $limit = 50): Collection;

    public function findChatsByProjectIdPaginated(int $projectId, PaginationParamsDto $paramsDto): LengthAwarePaginator;

    public function findMessagesByChatIdPaginated(int $chatId, object $paginationParams): LengthAwarePaginator;

    public function getUnreadMessagesCount(int $chatId, int $userId): int;

    public function getUnreadMessagesCountForProject(int $projectId, int $excludeCustomerId): int;

    public function findChatsByCustomerId(int $customerId): Collection;
}
