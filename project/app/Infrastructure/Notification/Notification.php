<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification;

use App\Domain\Notification\NotificationChannelInterface;

class Notification
{

    public static function channel(string $channel): NotificationChannelInterface
    {
        return match ($channel) {
            'email' => app(EmailNotification::class),
            'push' => app(PushNotification::class),
            default => 'unknown',
        };
    }
}
