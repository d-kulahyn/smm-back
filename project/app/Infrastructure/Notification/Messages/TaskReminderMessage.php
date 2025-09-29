<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification\Messages;

use Spatie\LaravelData\Data;

class TaskReminderMessage extends Data implements NotificationMessageInterface
{

    public function __construct(
        public string $message,
    ) {}

    public function create(): string
    {
        return $this->message;
    }
}
