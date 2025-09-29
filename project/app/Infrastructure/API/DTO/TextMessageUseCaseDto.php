<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use App\Domain\Enum\ChatMessageTypeEnum;
use App\Domain\Enum\SenderTypeEnum;
use Spatie\LaravelData\Data;

class TextMessageUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $customer_id,
        public int $chat_id,
        public string $message,
        public string $message_type = ChatMessageTypeEnum::TEXT->value,
        public string $sender_type = SenderTypeEnum::CUSTOMER->value,
        public ?array $metadata = null,
    ) {}
}
