<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class SocialMetric extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly string $platform,
        public readonly string $metric_type,
        public readonly string $metric_name,
        public readonly int $metric_value,
        public readonly string $metric_date,
        public readonly bool $is_manual,
        public readonly ?string $description,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isStoryMetric(): bool
    {
        return str_contains($this->metric_name, 'stories');
    }

    public function isPostMetric(): bool
    {
        return str_contains($this->metric_name, 'posts');
    }

    public function isEngagementMetric(): bool
    {
        return in_array($this->metric_name, ['likes', 'comments', 'shares', 'saves']);
    }
}

