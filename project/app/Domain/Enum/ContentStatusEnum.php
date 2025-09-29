<?php

namespace App\Domain\Enum;

enum ContentStatusEnum: string
{
    case DRAFT = 'draft';
    case PENDING_APPROVAL = 'pending_approval';
    case APPROVED = 'approved';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Черновик',
            self::PENDING_APPROVAL => 'На модерации',
            self::APPROVED => 'Одобрено',
            self::SCHEDULED => 'Запланировано',
            self::PUBLISHED => 'Опубликовано',
            self::REJECTED => 'Отклонено',
        };
    }
}
