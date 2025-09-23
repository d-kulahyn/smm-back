<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification\Messages;

use Kreait\Firebase\Messaging\CloudMessage;

interface FirebaseCloudMessagingInterface
{

    public function fcm(): CloudMessage;
}
