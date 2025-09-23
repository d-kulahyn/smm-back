<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class Task extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $status = 'pending',
        public readonly string $priority,
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly ?int $assigned_to,
        public readonly ?string $due_date,
        public readonly ?string $completed_at,
        public readonly ?string $notes,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isOverdue(): bool
    {
        return $this->due_date && now()->greaterThan($this->due_date) && !$this->isCompleted();
    }
}
