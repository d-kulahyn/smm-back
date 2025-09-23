<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectReport;

interface ProjectReportWriteRepositoryInterface
{
    public function create(array $data): ProjectReport;

    public function update(int $id, array $data): ProjectReport;

    public function delete(int $id): bool;

    public function markAsGenerated(int $id): ProjectReport;

    public function updateMetrics(int $id, array $manualMetrics, array $automatedMetrics): ProjectReport;
}
