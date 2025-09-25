<?php

namespace App\Application\UseCase;

use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Domain\Entity\Chat;
use App\Infrastructure\API\DTO\CreateChatDto;

readonly class CreateChatUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository,
    ) {}

    /**
     * @throws ProjectNotFoundException
     */
    public function execute(CreateChatDto $dto): Chat
    {
        return $this->chatWriteRepository->createChat($dto);
    }
}
