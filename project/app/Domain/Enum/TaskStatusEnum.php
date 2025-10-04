<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum TaskStatusEnum: string
{
    use AllCasesTrait;

    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'on_hold';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Ожидает выполнения',
            self::IN_PROGRESS => 'В работе',
            self::COMPLETED => 'Завершено',
            self::CANCELLED => 'Отменено',
        };
    }
}
