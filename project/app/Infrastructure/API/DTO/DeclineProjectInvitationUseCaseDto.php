<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class DeclineProjectInvitationUseCaseDto extends Data
{
    public function __construct(
        public string $token,
    ) {}

    public static function fromToken(string $token): self
    {
        return new self(token: $token);
    }
}
