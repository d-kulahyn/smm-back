<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification;

use App\Domain\Notification\NotificationChannelInterface;

class PushNotification implements NotificationChannelInterface
{
    public function send(string $message): void
    {
       echo "$message\n";
    }
}
