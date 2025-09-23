<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendVoiceMessageDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $message = 'Voice message',
        public string $message_type = 'voice',
        public string $sender_type = 'customer',
        public ?string $file_path = null,
        public ?string $file_name = null,
        public ?string $file_size = null,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'voice_file' => 'required|file|mimes:mp3,wav,ogg,m4a|max:5120',
        ];
    }
}
