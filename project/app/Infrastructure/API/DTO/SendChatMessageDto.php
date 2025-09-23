<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendChatMessageDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $message,
        public string $message_type = 'text',
        public string $sender_type = 'customer',
        public ?string $file_path = null,
        public ?string $file_name = null,
        public ?string $file_size = null,
        public ?array $metadata = null,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id'   => 'required|exists:projects,id',
            'message'      => 'required|string',
            'message_type' => 'nullable|in:text,voice,file,image',
            'sender_type'  => 'nullable|in:customer,admin',
            'file_path'    => 'nullable|string',
            'file_name'    => 'nullable|string',
            'file_size'    => 'nullable|string',
        ];
    }
}
