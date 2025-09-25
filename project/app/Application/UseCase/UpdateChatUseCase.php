<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Chat;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateChatDto;

readonly class UpdateChatUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository,
    ) {}

    /**
     * @throws ProjectNotFoundException
     */
    public function execute(int $chatId, CreateChatDto $dto): Chat
    {
        return $this->chatWriteRepository->updateChat($chatId, [
            'title' => $dto->title,
            'description' => $dto->description,
            'status' => $dto->status,
        ]);
    }
}
