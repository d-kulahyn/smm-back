<?php

namespace App\Infrastructure\Notification\Messages;

use Illuminate\Contracts\Mail\Mailable;

interface EmailMessageInterface
{
    public function email(): Mailable;
}
