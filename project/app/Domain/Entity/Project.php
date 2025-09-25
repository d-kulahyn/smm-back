<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Infrastructure\API\DTO\ProjectStatsDto;
use Spatie\LaravelData\Data;

class Project extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly string $status,
        public readonly int $customer_id,
        public readonly ?string $start_date,
        public readonly ?string $end_date,
        public readonly ?float $budget,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public ?ProjectStatsDto $statsDto = null,
        public array $tasks = [],
        public array $members = [],
        public array $invitations = [],
        public array $chats = []
    ) {}

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * @param array<Task> $tasks
     */
    public function setTasks(array $tasks): self
    {
        $this->tasks = $tasks;

        return $this;
    }

    public function setStats(ProjectStatsDto $statsDto): self
    {
        $this->statsDto = $statsDto;

        return $this;
    }

    /**
     * @param array<ProjectMember> $members
     */
    public function setMembers(array $members): self
    {
        $this->members = $members;

        return $this;
    }

    /**
     * @param array<ProjectInvitation> $invitations
     */
    public function setInvitations(array $invitations): self
    {
        $this->invitations = $invitations;

        return $this;
    }

    /**
     * @param array<Chat> $chats
     */
    public function setChats(array $chats): self
    {
        $this->chats = $chats;

        return $this;
    }
}
