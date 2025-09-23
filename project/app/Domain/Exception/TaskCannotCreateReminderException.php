<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class TaskCannotCreateReminderException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'TASK_REMINDER_CANNOT_CREATE';
    }

    public function getHttpStatusCode(): int
    {
        return 400;
    }

    public function __construct()
    {
        parent::__construct('Невозможно создать напоминание для задачи без срока выполнения');
    }
}
