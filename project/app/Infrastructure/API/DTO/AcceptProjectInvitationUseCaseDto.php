<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class AcceptProjectInvitationUseCaseDto extends Data
{
    public function __construct(
        public string $token,
        public int $user_id,
    ) {}

    public static function fromTokenAndUserId(string $token, int $userId): self
    {
        return new self(
            token: $token,
            user_id: $userId
        );
    }
}
