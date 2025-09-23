<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class MediaFileNotFoundException extends DomainException
{
    public function getErrorCode(): string
    {
        return 'MEDIA_FILE_NOT_FOUND';
    }

    public function getHttpStatusCode(): int
    {
        return 404;
    }

    public function __construct()
    {
        parent::__construct('Файл не найден');
    }
}
