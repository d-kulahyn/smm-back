<?php

namespace App\Infrastructure\Notification\Messages;

interface NotificationMessageInterface
{
    public function create(): mixed;
}
