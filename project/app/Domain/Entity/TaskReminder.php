<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class TaskReminder extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $task_id,
        public readonly int $customer_id,
        public readonly string $remind_at,
        public readonly string $reminder_type,
        public readonly ?string $message,
        public readonly bool $is_sent,
        public readonly ?string $sent_at,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isDue(): bool
    {
        return now()->greaterThanOrEqualTo($this->remind_at) && !$this->is_sent;
    }
}
