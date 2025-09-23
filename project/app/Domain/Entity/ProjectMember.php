<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use DateTimeImmutable;

class ProjectMember
{
    public function __construct(
        private readonly int $id,
        private readonly int $projectId,
        private readonly int $userId,
        private readonly string $role,
        private readonly ?array $permissions,
        private readonly DateTimeImmutable $joinedAt,
        private readonly DateTimeImmutable $createdAt,
        private readonly DateTimeImmutable $updatedAt,
        private readonly ?Customer $user = null,
        private readonly ?Project $project = null
    ) {}

    public function getId(): int
    {
        return $this->id;
    }

    public function getProjectId(): int
    {
        return $this->projectId;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function getPermissions(): ?array
    {
        return $this->permissions;
    }

    public function getJoinedAt(): DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getUser(): ?Customer
    {
        return $this->user;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

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
