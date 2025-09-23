<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\SocialMetric;
use Illuminate\Support\Collection;

interface SocialMetricReadRepositoryInterface
{
    public function findById(int $id): ?SocialMetric;

    public function findByProjectId(int $projectId): Collection;

    public function findByPlatform(int $projectId, string $platform): Collection;

    public function findByMetricType(int $projectId, string $metricType): Collection;

    public function findManualMetrics(int $projectId): Collection;

    public function findAutomatedMetrics(int $projectId): Collection;

    public function getMetricsForPeriod(int $projectId, string $startDate, string $endDate): Collection;

    public function getPredefinedMetrics(): Collection;
}
