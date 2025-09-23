<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SocialAuthDTO extends Data
{
    /**
     * @param string $access_token
     */
    public function __construct(
        public readonly string $access_token,
    ) {}
}
