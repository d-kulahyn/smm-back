<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Chat;
use App\Domain\Entity\ChatMessage;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\CreateChatDto;

interface ChatWriteRepositoryInterface
{
    public function createVoiceMessage(VoiceMessageUseCaseDto $data): ChatMessage;

    public function createTextMessage(TextMessageUseCaseDto $data): ChatMessage;

    public function createChat(CreateChatDto $data): Chat;

    public function updateChat(int $chatId, array $data): Chat;

    public function markAsRead(int $chatId): Chat;

    public function markMessageAsRead(int $messageId, int $customerId): void;

    public function markAllMessagesAsReadForProject(int $projectId, int $excludeCustomerId): int;

    public function deleteChat(int $chatId): bool;
}
