<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class StorybookNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'STORYBOOK_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct()
    {
        parent::__construct('История не найдена');
    }
}
