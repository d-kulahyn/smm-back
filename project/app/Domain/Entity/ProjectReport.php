<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class ProjectReport extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly string $report_date,
        public readonly string $period_type,
        public readonly ?array $manual_metrics,
        public readonly ?array $automated_metrics,
        public readonly ?array $social_metrics,
        public readonly ?array $summary_data,
        public readonly bool $is_generated,
        public readonly ?string $generated_at,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function getTotalReach(): int
    {
        $reach = 0;

        if ($this->automated_metrics) {
            foreach ($this->automated_metrics as $platform => $metrics) {
                $reach += $metrics['reach'] ?? 0;
            }
        }

        if ($this->manual_metrics) {
            $reach += $this->manual_metrics['manual_reach'] ?? 0;
        }

        return $reach;
    }

    public function getTotalEngagement(): int
    {
        $engagement = 0;

        if ($this->automated_metrics) {
            foreach ($this->automated_metrics as $platform => $metrics) {
                $engagement += ($metrics['likes'] ?? 0) +
                              ($metrics['comments'] ?? 0) +
                              ($metrics['shares'] ?? 0);
            }
        }

        return $engagement;
    }

    public function getEngagementRate(): float
    {
        $reach = $this->getTotalReach();
        $engagement = $this->getTotalEngagement();

        return $reach > 0 ? round(($engagement / $reach) * 100, 2) : 0.0;
    }
}
