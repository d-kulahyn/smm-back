<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendProjectInvitationUseCaseDto extends Data
{
    public function __construct(
        public int $project_id,
        public int $invited_by,
        public ?int $invited_user_id = null,
        public string $role = 'member',
        public ?array $permissions = null,
    ) {}
}
