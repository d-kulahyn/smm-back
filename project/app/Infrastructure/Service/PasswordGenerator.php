<?php

declare(strict_types=1);

namespace App\Infrastructure\Service;

use Random\RandomException;

class PasswordGenerator
{
    /**
     * @throws RandomException
     */
    public function generate(int $length = 8): string
    {
        return bin2hex(random_bytes($length));
    }
}
