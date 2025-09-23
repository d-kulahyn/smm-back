<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ProjectAccessDeniedException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'PROJECT_ACCESS_DENIED';
    }

    public function getHttpStatusCode(): int
    {
        return 403;
    }

    public function __construct()
    {
        parent::__construct('Доступ к проекту запрещен');
    }
}
