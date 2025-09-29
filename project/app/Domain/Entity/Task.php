<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Enum\StatusEnum;
use Spatie\LaravelData\Data;

class Task extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly string $priority,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $status = StatusEnum::PENDING->value,
        public readonly ?string $due_date = null,
        public readonly ?int $assigned_to = null,
        public readonly ?array $metadata = null,
        public readonly ?array $notes = null,
        public readonly ?string $created_at = null,
        public readonly ?string $completed_at = null,
        public readonly ?string $updated_at = null,
        public ?Project $project = null
    ) {}

    public function isCompleted(): bool
    {
        return $this->status === StatusEnum::COMPLETED->value;
    }

    public function isOverdue(): bool
    {
        return $this->due_date && now()->greaterThan($this->due_date) && !$this->isCompleted();
    }
}
