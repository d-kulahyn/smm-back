<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use App\Domain\Enum\TaskPriorityEnum;
use App\Domain\Enum\TaskStatusEnum;
use Spatie\LaravelData\Data;

class CreateTaskUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $title,
        public ?string $description = null,
        public string $status = TaskStatusEnum::PENDING->value,
        public string $priority = TaskPriorityEnum::MEDIUM->value,
        public ?int $assigned_to = null,
        public ?string $due_date = null,
        public ?int $reminder_before_hours = null,
    ) {}

    public static function fromCreateTaskDto(CreateTaskDto $dto, int $customerId): self
    {
        return new self(
            project_id           : $dto->project_id,
            title                : $dto->title,
            customer_id          : $customerId,
            description          : $dto->description,
            status               : $dto->status ?? 'pending',
            priority             : $dto->priority ?? 'medium',
            assigned_to          : $dto->assigned_to,
            due_date             : $dto->due_date,
            reminder_before_hours: $dto->reminder_before_hours
        );
    }

    public function hasAssignedUser(): bool
    {
        return $this->assigned_to !== null;
    }
}
