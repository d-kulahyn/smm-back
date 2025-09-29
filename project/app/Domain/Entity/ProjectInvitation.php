<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Enum\StatusEnum;
use App\Domain\Enum\InvitationStatusEnum;
use Spatie\LaravelData\Data;

class ProjectInvitation extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly int $invited_by,
        public readonly ?int $invited_user_id,
        public readonly ?string $email,
        public readonly string $role, // 'manager', 'member', 'viewer'
        public readonly array $permissions,
        public readonly string $status, // 'pending', 'accepted', 'declined', 'expired'
        public readonly string $token,
        public readonly ?string $expires_at,
        public readonly ?string $accepted_at,
        public readonly ?string $declined_at,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public ?Project $project = null,
        public ?Customer $invitedBy = null,
        public ?Customer $invitedUser = null
    ) {}

    public function isPending(): bool
    {
        return $this->status === StatusEnum::PENDING->value;
    }

    public function isAccepted(): bool
    {
        return $this->status === InvitationStatusEnum::ACCEPTED->value;
    }

    public function isDeclined(): bool
    {
        return $this->status === InvitationStatusEnum::DECLINED->value;
    }

    public function isExpired(): bool
    {
        return $this->status === InvitationStatusEnum::EXPIRED->value || ($this->expires_at && now() > $this->expires_at);
    }

    public function canBeAccepted(): bool
    {
        return $this->isPending() && !$this->isExpired();
    }
}
