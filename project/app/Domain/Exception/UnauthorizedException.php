<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class UnauthorizedException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'UNAUTHORIZED';
    }

    public function getHttpStatusCode(): int
    {
        return 401;
    }

    public function __construct()
    {
        parent::__construct('Неавторизованный доступ');
    }
}
