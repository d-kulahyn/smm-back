<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum StoryTypeEnum: string
{
    use AllCasesTrait;

    case IMAGE = 'image';
    case VIDEO = 'video';
    case BOOMERANG = 'boomerang';
    case TEXT = 'text';

    public function label(): string
    {
        return match ($this) {
            self::IMAGE => 'Изображение',
            self::VIDEO => 'Видео',
            self::BOOMERANG => 'Бумеранг',
            self::TEXT => 'Текст',
        };
    }
}
