<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class SendProjectInvitationDto extends Data
{
    public function __construct(
        public readonly string $invited_user_id,
        public readonly string $role,
        public readonly array $permissions = []
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'invited_user_id'       => 'required|integer|exists:customers,id',
            'role'          => 'required|string',
            'permissions'   => 'array',
            'permissions.*' => 'string',
        ];
    }
}
