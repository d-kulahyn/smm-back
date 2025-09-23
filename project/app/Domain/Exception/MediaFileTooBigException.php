<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class MediaFileTooBigException extends DomainException
{
    private int $maxSizeInMb;

    public function getErrorCode(): string
    {
        return 'MEDIA_FILE_TOO_BIG';
    }

    public function getHttpStatusCode(): int
    {
        return 422;
    }

    public function __construct(int $maxSizeInMb = 10)
    {
        $this->maxSizeInMb = $maxSizeInMb;
        parent::__construct("Файл слишком большой. Максимальный размер: {$maxSizeInMb}MB");
    }

    public function getErrorDetails(): array
    {
        return [
            'max_size_mb' => $this->maxSizeInMb
        ];
    }
}
