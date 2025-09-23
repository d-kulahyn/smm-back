<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class UpdateTaskUseCaseDto extends Data
{
    public function __construct(
        public ?string $title = null,
        public ?string $description = null,
        public ?int $assigned_to = null,
        public ?string $priority = null,
        public ?string $status = null,
        public ?string $due_date = null,
        public ?int $reminder_before_hours = null,
    ) {}

    public static function fromCreateTaskDto(CreateTaskDto $dto): self
    {
        return new self(
            title                : $dto->title,
            description          : $dto->description,
            assigned_to          : $dto->assigned_to,
            priority             : $dto->priority,
            status               : $dto->status,
            due_date             : $dto->due_date,
            reminder_before_hours: $dto->reminder_before_hours
        );
    }
}
