<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ChatNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'CHAT_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct()
    {
        parent::__construct('Сообщение не найдено');
    }
}
