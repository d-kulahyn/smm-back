<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendProjectInvitationUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $invited_by,
        public string $email,
        public ?int $user_id = null,
        public string $role = 'member',
        public ?array $permissions = null,
    ) {}

    public static function fromSendProjectInvitationDto(
        SendProjectInvitationDto $dto,
        int $projectId,
        int $invitedBy
    ): self {
        return new self(
            project_id: $projectId,
            invited_by: $invitedBy,
            email: $dto->email,
            user_id: $dto->user_id,
            role: $dto->role ?? 'member',
            permissions: $dto->permissions
        );
    }
}
