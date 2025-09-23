<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class Chat extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly string $message,
        public readonly string $message_type,
        public readonly string $sender_type,
        public readonly ?string $file_path,
        public readonly ?string $file_name,
        public readonly ?string $file_size,
        public readonly bool $is_read,
        public readonly ?string $read_at,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public ?Customer $customer = null
    ) {}

    public function isVoiceMessage(): bool
    {
        return $this->message_type === 'voice';
    }

    public function isFromCustomer(): bool
    {
        return $this->sender_type === 'customer';
    }
}
