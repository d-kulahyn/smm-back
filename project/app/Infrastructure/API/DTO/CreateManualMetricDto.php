<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateManualMetricDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $platform,
        public string $metric_type,
        public string $metric_name,
        public int $metric_value,
        public string $metric_date,
        public ?string $description = null,
        public ?array $metadata = null,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'platform' => 'required|in:instagram,facebook,tiktok,youtube,twitter,linkedin,telegram,all',
            'metric_type' => 'required|in:content,audience,engagement,reach,advertising',
            'metric_name' => 'required|string|max:255',
            'metric_value' => 'required|integer|min:0',
            'metric_date' => 'required|date',
            'description' => 'nullable|string|max:500',
            'metadata' => 'nullable|array',
        ];
    }
}
