<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use DateTimeImmutable;
use Spatie\LaravelData\Data;

class ProjectMember extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $projectId,
        public readonly int $userId,
        public readonly string $role,
        public readonly ?array $permissions,
        public readonly DateTimeImmutable $joinedAt,
        public readonly DateTimeImmutable $createdAt,
        public readonly DateTimeImmutable $updatedAt,
        public readonly ?Customer $user = null,
        public readonly ?Project $project = null
    ) {}

    /**
     * Check if the member has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Check if the member is owner
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Check if the member is manager or higher
     */
    public function isManagerOrHigher(): bool
    {
        return in_array($this->role, ['owner', 'manager']);
    }

    /**
     * Check if the member can manage other members
     */
    public function canManageMembers(): bool
    {
        return $this->isManagerOrHigher() || $this->hasPermission('manage_members');
    }

    /**
     * Check if the member can edit project
     */
    public function canEditProject(): bool
    {
        return $this->isManagerOrHigher() || $this->hasPermission('edit_project');
    }
}
