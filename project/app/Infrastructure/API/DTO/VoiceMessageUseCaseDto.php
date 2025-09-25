<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class VoiceMessageUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $customer_id,
        public int $chat_id,
        public string $message_type,
        public string $sender_type,
        public string $file_path,
        public string $file_name,
        public int $file_size,
        public ?string $message = null,
        public ?array $metadata = null,
    ) {}

    public function isVoiceMessage(): bool
    {
        return $this->message_type === 'voice';
    }
}
