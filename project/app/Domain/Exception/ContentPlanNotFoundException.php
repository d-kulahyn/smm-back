<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ContentPlanNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'CONTENT_PLAN_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct()
    {
        parent::__construct('Контент-план не найден');
    }
}
