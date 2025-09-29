<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum InvitationStatusEnum: string
{
    use AllCasesTrait;

    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case EXPIRED = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Ожидает ответа',
            self::ACCEPTED => 'Принято',
            self::DECLINED => 'Отклонено',
            self::EXPIRED => 'Истекло',
        };
    }
}
