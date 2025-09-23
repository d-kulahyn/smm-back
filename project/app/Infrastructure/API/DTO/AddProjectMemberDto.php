<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class AddProjectMemberDto extends Data
{
    public function __construct(
        #[Required]
        public readonly int $user_id,

        #[Required]
        #[In(['owner', 'manager', 'member', 'viewer'])]
        public readonly string $role,

        public readonly array $permissions = []
    ) {}
}
