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
        public readonly ?Task $task,
        public readonly ?string $message = null,
        public readonly bool $is_sent,
        public readonly ?string $sent_at = null,
        public readonly ?array $metadata = null,
        public readonly ?string $created_at = null,
        public readonly ?string $updated_at = null,
    ) {}

    public function isDue(): bool
    {
        return now()->greaterThanOrEqualTo($this->remind_at) && !$this->is_sent;
    }
}
