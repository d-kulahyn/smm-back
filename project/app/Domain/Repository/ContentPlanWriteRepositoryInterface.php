<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ContentPlan;

interface ContentPlanWriteRepositoryInterface
{
    public function create(array $data): ContentPlan;

    public function update(int $id, array $data): ContentPlan;

    public function delete(int $id): bool;

    public function updateStatus(int $id, string $status): ContentPlan;

    public function scheduleContent(int $id, string $scheduledDate): ContentPlan;
}
