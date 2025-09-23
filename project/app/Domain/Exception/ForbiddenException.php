<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ForbiddenException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'FORBIDDEN';
    }

    public function getHttpStatusCode(): int
    {
        return 403;
    }

    public function __construct(string $message = 'Доступ запрещен')
    {
        parent::__construct($message);
    }
}
