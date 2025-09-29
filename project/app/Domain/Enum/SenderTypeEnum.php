<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum SenderTypeEnum: string
{
    use AllCasesTrait;

    case CUSTOMER = 'customer';
    case ADMIN = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::CUSTOMER => 'Клиент',
            self::ADMIN => 'Администратор',
        };
    }
}
