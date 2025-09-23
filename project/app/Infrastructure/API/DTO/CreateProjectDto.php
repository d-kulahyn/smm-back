<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateProjectDto extends Data
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public string $status = 'active',
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?float $budget = null,
        public ?array $metadata = null,
    ) {}

    public static function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:active,completed,on_hold,cancelled',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'budget'      => 'nullable|numeric|min:0',
        ];
    }
}
