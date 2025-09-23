<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ContentPlanInvalidScheduleException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'CONTENT_PLAN_INVALID_SCHEDULE';
    }

    public function getHttpStatusCode(): int
    {
        return 422;
    }

    public function __construct()
    {
        parent::__construct('Невозможно запланировать контент на прошедшую дату');
    }
}
