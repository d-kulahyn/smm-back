<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use App\Domain\Enum\TaskPriorityEnum;
use App\Domain\Enum\TaskStatusEnum;
use Spatie\LaravelData\Data;

class CreateTaskDto extends Data
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
        public ?string $notes = null,
        public ?array $metadata = null,
    ) {}

    public static function rules(): array
    {
        return [
            'title'                 => 'required|string|max:255',
            'project_id'            => 'required|exists:projects,id',
            'description'           => 'nullable|string',
            'priority'              => 'nullable|in:low,medium,high,urgent',
            'assigned_to'           => 'nullable|exists:customers,id',
            'due_date'              => 'nullable|date|after:now',
            'reminder_before_hours' => 'nullable|integer|min:1|max:72',
            'notes'                 => 'nullable|string',
        ];
    }
}
