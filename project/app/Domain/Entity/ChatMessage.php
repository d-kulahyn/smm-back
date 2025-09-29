<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Enum\ChatMessageTypeEnum;
use App\Domain\Enum\SenderTypeEnum;
use Spatie\LaravelData\Data;

class ChatMessage extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $chat_id,
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly ?string $message = null,
        public readonly string $message_type,
        public readonly string $sender_type,
        public readonly ?string $file_path = null,
        public readonly ?string $file_name = null,
        public readonly ?int $file_size = null,
        public readonly ?array $metadata = null,
        public readonly ?string $created_at = null,
        public readonly ?string $updated_at = null,
        public ?Chat $chat = null,
        public ?Customer $customer = null,
        public ?Project $project = null
    ) {}

    public function isVoiceMessage(): bool
    {
        return $this->message_type === ChatMessageTypeEnum::VOICE->value;
    }

    public function isFromCustomer(): bool
    {
        return $this->sender_type === SenderTypeEnum::CUSTOMER->value;
    }

    public function hasFile(): bool
    {
        return !empty($this->file_path);
    }
}
