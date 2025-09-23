<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Project;

interface ProjectWriteRepositoryInterface
{
    public function create(array $data): Project;

    public function update(int $id, array $data): Project;

    public function delete(int $id): bool;

    public function updateStatus(int $id, string $status): Project;
}
