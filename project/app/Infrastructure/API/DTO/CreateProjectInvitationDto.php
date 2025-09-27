<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateProjectInvitationDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $invited_by,
        public int $invited_user_id,
        public string $role,
        public array $permissions,
        public string $token,
        public string $expires_at,
        public string $status,
    ) {}

    public static function create(
        int $projectId,
        int $invitedBy,
        int $invited_user_id,
        string $role,
        array $permissions
    ): self {
        return new self(
            project_id : $projectId,
            invited_by : $invitedBy,
            invited_user_id: $invited_user_id,
            role       : $role,
            permissions: $permissions,
            token      : bin2hex(random_bytes(32)),
            expires_at : now()->addDays(7)->toDateTimeString(),
            status     : 'pending'
        );
    }
}
