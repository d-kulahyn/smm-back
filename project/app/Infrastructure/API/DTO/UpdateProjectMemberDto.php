<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Data;

class UpdateProjectMemberDto extends Data
{
    public function __construct(
        #[In(['owner', 'manager', 'member', 'viewer'])]
        public readonly ?string $role = null,

        public readonly ?array $permissions = null
    ) {}
}
