<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\SocialMetric;
use Illuminate\Support\Collection;

interface SocialMetricWriteRepositoryInterface
{
    public function create(array $data): SocialMetric;

    public function update(int $id, array $data): SocialMetric;

    public function delete(int $id): bool;

    public function createBulk(array $metrics): Collection;

    public function updateMetricValue(int $id, int $newValue): SocialMetric;
}
