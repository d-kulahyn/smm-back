<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification;

interface PostNotificationCallback
{
    public function execute(): void;
}
