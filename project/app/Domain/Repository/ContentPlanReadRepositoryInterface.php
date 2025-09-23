<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ContentPlan;
use Illuminate\Support\Collection;

interface ContentPlanReadRepositoryInterface
{
    public function findById(int $id): ?ContentPlan;

    public function findByProjectId(int $projectId): Collection;

    public function findByStatus(string $status): Collection;

    public function findByPlatform(string $platform): Collection;

    public function findScheduledForDate(string $date): Collection;

    public function findByAssignedTo(int $customerId): Collection;

    public function getContentCalendar(int $projectId, string $startDate, string $endDate): Collection;
}
