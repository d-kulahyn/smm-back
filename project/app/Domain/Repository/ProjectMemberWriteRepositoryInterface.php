<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\ProjectMember;

interface ProjectMemberWriteRepositoryInterface
{
    public function create(array $data): ProjectMember;

    public function update(int $id, array $data): ProjectMember;

    public function delete(int $id): bool;

    public function addMember(int $projectId, int $userId, string $role, array $permissions = []): ProjectMember;

    public function updateRole(int $projectId, int $userId, string $role): ProjectMember;

    public function updatePermissions(int $projectId, int $userId, array $permissions): ProjectMember;

    public function removeMember(int $projectId, int $userId): bool;
}
