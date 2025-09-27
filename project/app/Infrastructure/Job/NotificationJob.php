<?php

namespace App\Infrastructure\Job;

use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Infrastructure\Notification\Notification;

class NotificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly array $channels,
        public readonly string $message,
        public readonly ?array $callback = null,
    ) {}

    public function handle(): void
    {
        foreach ($this->channels as $channel) {
            Notification::channel($channel)->send($this->message);
            if (!is_null($this->callback)) {
                $callback = $this->callback['class'];
                app($callback, $this->callback['data'])->execute();
            }
        }
    }
}
