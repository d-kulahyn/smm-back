<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ChatMessage;
use App\Domain\Event\ChatMessageSentEvent;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use App\Infrastructure\API\Resource\ChatMessageResource;

readonly class SendChatMessageUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository,
        private ChatReadRepositoryInterface $chatReadRepository,
    ) {}

    public function execute(VoiceMessageUseCaseDto|TextMessageUseCaseDto $data): ChatMessage
    {
        $chat = $this->chatReadRepository->findChatById($data->chat_id);

        if ($data instanceof VoiceMessageUseCaseDto) {
            $message = $this->chatWriteRepository->createVoiceMessage($data);

            event(new ChatMessageSentEvent($data->customer_id, new ChatMessageResource($message), $chat));

            return $message;
        }

        $message = $this->chatWriteRepository->createTextMessage($data);

        event(new ChatMessageSentEvent($data->customer_id, new ChatMessageResource($message), $chat));

        return $message;
    }
}
