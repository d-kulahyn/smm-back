<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Project;
use App\Infrastructure\API\DTO\CreateProjectDto;

interface ProjectWriteRepositoryInterface
{
    public function create(CreateProjectDto $data): Project;

    public function update(int $id, array $data): Project;

    public function delete(int $id): bool;

    public function updateStatus(int $id, string $status): Project;
}
