<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class VoiceMessageUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $customer_id,
        public string $message,
        public string $message_type,
        public string $sender_type,
        public string $file_path,
        public string $file_name,
        public string $file_size,
        public ?array $metadata = null,
    ) {}

    public static function fromVoiceFile(
        int $projectId,
        int $customerId,
        string $filePath,
        string $fileName,
        int $fileSize,
        array $metadata = null
    ): self {
        return new self(
            project_id: $projectId,
            customer_id: $customerId,
            message: 'Voice message',
            message_type: 'voice',
            sender_type: 'customer',
            file_path: $filePath,
            file_name: $fileName,
            file_size: (string)$fileSize,
            metadata: $metadata
        );
    }

    public function isVoiceMessage(): bool
    {
        return $this->message_type === 'voice';
    }
}
