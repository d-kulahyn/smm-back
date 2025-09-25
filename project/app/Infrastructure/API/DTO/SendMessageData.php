<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendMessageData extends Data
{
    public function __construct(
        public string $message,
        public string $message_type = 'text',
        public ?string $sender_type = 'customer',
    ) {}

    public static function rules(): array
    {
        return [
            'message' => 'required|string|max:5000',
            'message_type' => 'nullable|string|in:text,voice,file,image',
            'sender_type' => 'nullable|string|in:customer,admin'
        ];
    }

    public static function messages(): array
    {
        return [
            'message.required' => 'Message content is required',
            'message.max' => 'Message cannot exceed 5000 characters',
            'message_type.in' => 'Message type must be one of: text, voice, file, image',
            'sender_type.in' => 'Sender type must be one of: customer, admin'
        ];
    }
}
