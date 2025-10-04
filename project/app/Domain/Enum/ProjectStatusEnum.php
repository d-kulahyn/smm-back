<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum ProjectStatusEnum: string
{
    use AllCasesTrait;

    case ACTIVE = 'active';
    case COMPLETED = 'on_hold';
    case ON_HOLD = 'on_hold';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Активный',
            self::COMPLETED => 'Завершен',
            self::ON_HOLD => 'Приостановлен',
            self::CANCELLED => 'Отменен',
        };
    }
}
