<?php

declare(strict_types=1);

namespace App\Domain\Exception;


class MediaFileInvalidTypeException extends DomainException
{
    private array $allowedTypes;

    public function getErrorCode(): string
    {
        return 'MEDIA_FILE_INVALID_TYPE';
    }

    public function getHttpStatusCode(): int
    {
        return 422;
    }

    public function __construct(array $allowedTypes = [])
    {
        $this->allowedTypes = $allowedTypes;
        $message = 'Недопустимый тип файла';
        if (!empty($allowedTypes)) {
            $message .= '. Разрешены: ' . implode(', ', $allowedTypes);
        }
        parent::__construct($message);
    }

    public function getErrorDetails(): array
    {
        return [
            'allowed_types' => $this->allowedTypes
        ];
    }
}
