<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class TaskAccessDeniedException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'TASK_ACCESS_DENIED';
    }

    public function getHttpStatusCode(): int
    {
        return 403;
    }

    public function __construct()
    {
        parent::__construct('Доступ к задаче запрещен');
    }
}
