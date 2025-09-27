<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification;

use Illuminate\Support\Facades\Mail;
use App\Domain\Notification\NotificationChannelInterface;

class EmailNotification implements NotificationChannelInterface
{
    public function send(object $message): void
    {
        Mail::to(request()->user()->email)->sendNow($message->email());
    }
}
