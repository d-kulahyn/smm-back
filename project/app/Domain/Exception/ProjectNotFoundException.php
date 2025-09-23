<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ProjectNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'PROJECT_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct()
    {
        parent::__construct('Проект не найден');
    }
}
