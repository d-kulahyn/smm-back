<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class CustomerNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'CUSTOMER_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct(string $message = 'Customer not found')
    {
        parent::__construct($message);
    }
}
