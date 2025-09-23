<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class SendProjectInvitationDto extends Data
{
    public function __construct(
        #[Email]
        public readonly ?string $email = null,

        public readonly ?int $user_id = null,

        #[Required]
        #[In(['manager', 'member', 'viewer'])]
        public readonly string $role,

        public readonly array $permissions = []
    ) {}
}
