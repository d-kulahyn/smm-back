<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;
use App\Domain\Enum\ChatMessageTypeEnum;

class SendMessageData extends Data
{
    public function __construct(
        public string $message,
        public string $message_type = ChatMessageTypeEnum::TEXT->value,
    ) {}

    public static function rules(): array
    {
        return [
            'message'      => 'required|string|max:5000',
            'message_type' => 'nullable|string|in:'.implode(',', ChatMessageTypeEnum::values()),
        ];
    }
}
