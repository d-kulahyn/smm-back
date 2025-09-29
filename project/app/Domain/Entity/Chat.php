<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;
use App\Domain\Enum\ChatStatusEnum;

class Chat extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $status,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public readonly ?int $unread_messages_count = null,
        public ?Customer $customer = null,
        public ?Project $project = null,
        public array $members = []
    ) {}

    public function isActive(): bool
    {
        return $this->status === ChatStatusEnum::ACTIVE->value;
    }

    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }
}
