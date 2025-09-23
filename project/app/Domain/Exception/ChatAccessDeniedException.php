<?php

declare(strict_types=1);

namespace App\Domain\Exception;


class ChatAccessDeniedException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'CHAT_ACCESS_DENIED';
    }

    public function getHttpStatusCode(): int
    {
        return 403;
    }

    public function __construct()
    {
        parent::__construct('Доступ к чату запрещен');
    }
}
