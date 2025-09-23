<?php

namespace App\Domain\Enum;

enum PlatformEnum: string
{
    case INSTAGRAM = 'instagram';
    case FACEBOOK = 'facebook';
    case TIKTOK = 'tiktok';
    case YOUTUBE = 'youtube';
    case TWITTER = 'twitter';
    case LINKEDIN = 'linkedin';
    case TELEGRAM = 'telegram';

    public function label(): string
    {
        return match($this) {
            self::INSTAGRAM => 'Instagram',
            self::FACEBOOK => 'Facebook',
            self::TIKTOK => 'TikTok',
            self::YOUTUBE => 'YouTube',
            self::TWITTER => 'Twitter',
            self::LINKEDIN => 'LinkedIn',
            self::TELEGRAM => 'Telegram',
        };
    }
}
