<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Exception\BadRequestDomainException;
use App\Infrastructure\API\DTO\ReadMessagesRequestDto;
use App\Domain\Repository\ChatWriteRepositoryInterface;

class MarkMessageAsReadUseCase
{
    public function __construct(
        private readonly ChatWriteRepositoryInterface $chatWriteRepository,
    ) {}

    /**
     * @throws BadRequestDomainException
     */
    public function execute(ReadMessagesRequestDto $dto, int $chatId, int $customerId): void
    {
        $this->chatWriteRepository->markMessagesAsRead($dto->messages_ids, $customerId);
    }
}
