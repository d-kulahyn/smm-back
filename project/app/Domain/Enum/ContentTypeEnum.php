<?php

declare(strict_types=1);

namespace App\Domain\Enum;

enum ContentTypeEnum: string
{
    case POST = 'post';
    case STORY = 'story';
    case REEL = 'reel';
    case VIDEO = 'video';
    case CAROUSEL = 'carousel';
    case LIVE = 'live';

    public function label(): string
    {
        return match($this) {
            self::POST => 'Пост',
            self::STORY => 'История',
            self::REEL => 'Рилс',
            self::VIDEO => 'Видео',
            self::CAROUSEL => 'Карусель',
            self::LIVE => 'Прямой эфир',
        };
    }
}
