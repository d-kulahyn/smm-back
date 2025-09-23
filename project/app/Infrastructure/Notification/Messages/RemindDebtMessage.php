<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification\Messages;

use Illuminate\Contracts\Mail\Mailable;
use App\Application\Mail\RemindDebtEmail;
use Kreait\Firebase\Messaging\CloudMessage;

/**
 * Class RemindDebtMessage
 *
 * @@property-read float $amount
 * @@property-read string $currency
 * @@property-read string $group_name
 * @@property-read string $creditor_name
 * @@property-read string|null $token
 */
class RemindDebtMessage extends BaseMessage implements FirebaseCloudMessagingInterface, EmailMessageInterface
{
    /**
     * @return Mailable
     */
    public function email(): Mailable
    {
        return new RemindDebtEmail(
            $this->amount,
            $this->currency,
            $this->group_name,
            $this->creditor_name
        );
    }

    /**
     * @return CloudMessage
     */
    public function fcm(): CloudMessage
    {
        return CloudMessage::new()
            ->withNotification([
                'title' => '👺 Debt Reminder',
                'body'  => "You owe 💵 {$this->amount} {$this->currency} to 👤 {$this->creditor_name} in {$this->group_name}",
            ])
            ->toToken($this->token);
    }
}
