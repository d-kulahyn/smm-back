<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectReport;
use Illuminate\Support\Collection;

interface ProjectReportReadRepositoryInterface
{
    public function findById(int $id): ?ProjectReport;

    public function findByProjectId(int $projectId): Collection;

    public function findByPeriod(int $projectId, string $startDate, string $endDate): Collection;

    public function findByPeriodType(int $projectId, string $periodType): Collection;

    public function getLatestReport(int $projectId): ?ProjectReport;

    public function getGeneratedReports(int $projectId): Collection;
}
