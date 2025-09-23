<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class TextMessageUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $customer_id,
        public string $message,
        public string $message_type = 'text',
        public string $sender_type = 'customer',
        public ?array $metadata = null,
    ) {}

    public static function fromTextMessage(
        int $projectId,
        int $customerId,
        string $message,
        string $messageType = 'text',
        array $metadata = null
    ): self {
        return new self(
            project_id  : $projectId,
            customer_id : $customerId,
            message     : $message,
            message_type: $messageType,
            sender_type : 'customer',
            metadata    : $metadata
        );
    }
}
