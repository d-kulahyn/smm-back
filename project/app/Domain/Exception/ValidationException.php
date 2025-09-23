<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ValidationException extends DomainException
{
    private array $errors;

    public function getErrorCode(): string
    {
        return 'VALIDATION_FAILED';
    }

    public function getHttpStatusCode(): int
    {
        return 422;
    }

    public function __construct(array $errors = [])
    {
        $this->errors = $errors;
        parent::__construct('Ошибка валидации данных');
    }

    public function getErrorDetails(): array
    {
        return [
            'validation_errors' => $this->errors
        ];
    }
}
