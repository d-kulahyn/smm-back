<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class BadRequestDomainException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'BAD_REQUEST';
    }

    public function getHttpStatusCode(): int
    {
        return 400;
    }

    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
