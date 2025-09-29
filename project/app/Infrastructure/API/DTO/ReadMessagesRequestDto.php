<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class ReadMessagesRequestDto extends Data
{

    public function __construct(
        public readonly array $messages_ids
    ) {}

    public static function rules(): array
    {
        return [
            'messages_ids'   => 'required|array',
            'messages_ids.*' => 'integer|exists:chat_messages,id',
        ];
    }
}
