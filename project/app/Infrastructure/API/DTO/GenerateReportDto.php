<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;


use Spatie\LaravelData\Data;

class GenerateReportDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $period_type = 'monthly',
        public ?string $start_date = null,
        public ?string $end_date = null,
        public bool $include_automated = true,
        public bool $include_manual = true,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id'        => 'required|exists:projects,id',
            'period_type'       => 'required|in:daily,weekly,monthly,custom',
            'start_date'        => 'nullable|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'include_automated' => 'boolean',
            'include_manual'    => 'boolean',
        ];
    }
}
