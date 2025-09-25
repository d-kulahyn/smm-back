<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ChatMessage;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;

readonly class SendChatMessageUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository,
    ) {}

    public function execute(VoiceMessageUseCaseDto|TextMessageUseCaseDto $data): ChatMessage
    {
        if ($data instanceof VoiceMessageUseCaseDto) {
            return $this->chatWriteRepository->createVoiceMessage($data);
        }

        return $this->chatWriteRepository->createTextMessage($data);
    }
}
