<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

readonly class CreateProjectInvitationDto
{
    public function __construct(
        public int $project_id,
        public int $invited_by,
        public string $email,
        public string $role,
        public array $permissions,
        public string $token,
        public string $expires_at,
        public string $status,
    ) {}

    public static function create(
        int $projectId,
        int $invitedBy,
        string $email,
        string $role,
        array $permissions
    ): self {
        return new self(
            project_id: $projectId,
            invited_by: $invitedBy,
            email: $email,
            role: $role,
            permissions: $permissions,
            token: bin2hex(random_bytes(32)),
            expires_at: now()->addDays(7)->toDateTimeString(),
            status: 'pending'
        );
    }

    public function toArray(): array
    {
        return [
            'project_id'  => $this->project_id,
            'invited_by'  => $this->invited_by,
            'email'       => $this->email,
            'role'        => $this->role,
            'permissions' => $this->permissions,
            'token'       => $this->token,
            'expires_at'  => $this->expires_at,
            'status'      => $this->status,
        ];
    }
}
