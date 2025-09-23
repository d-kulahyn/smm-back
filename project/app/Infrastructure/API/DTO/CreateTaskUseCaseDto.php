<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateTaskUseCaseDto extends Data
{
    public function __construct(
        public string $title,
        public int $project_id,
        public int $customer_id,
        public ?string $description = null,
        public ?int $assigned_to = null,
        public string $priority = 'medium',
        public string $status = 'pending',
        public ?string $due_date = null,
        public ?int $reminder_before_hours = null,
    ) {}

    public static function fromCreateTaskDto(CreateTaskDto $dto, int $customerId): self
    {
        return new self(
            title                : $dto->title,
            project_id           : $dto->project_id,
            customer_id          : $customerId,
            description          : $dto->description,
            assigned_to          : $dto->assigned_to,
            priority             : $dto->priority ?? 'medium',
            status               : $dto->status ?? 'pending',
            due_date             : $dto->due_date,
            reminder_before_hours: $dto->reminder_before_hours
        );
    }
}
