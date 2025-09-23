<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Chat;
use App\Domain\Event\ChatMessageSentEvent;
use App\Domain\Event\VoiceMessageSentEvent;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;

class SendChatMessageUseCase
{
    public function __construct(
        private ChatWriteRepositoryInterface $chatWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(VoiceMessageUseCaseDto|TextMessageUseCaseDto $data): Chat
    {
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        $chat = $this->chatWriteRepository->create($data);

        if ($data->isVoiceMessage()) {
            event(new VoiceMessageSentEvent($data->project_id, $chat));

            return $chat;
        }

        event(new ChatMessageSentEvent($data->project_id, $chat));

        return $chat;
    }
}
