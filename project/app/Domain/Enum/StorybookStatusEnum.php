<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum StorybookStatusEnum: string
{
    use AllCasesTrait;

    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case EXPIRED = 'expired';
    case SCHEDULED = 'scheduled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Черновик',
            self::ACTIVE => 'Активный',
            self::EXPIRED => 'Истёк',
            self::SCHEDULED => 'Запланированный',
        };
    }
}
