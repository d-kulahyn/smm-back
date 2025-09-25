<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class SendVoiceMessageData extends Data
{
    public function __construct(
        public mixed $voice_file,
    ) {}

    public static function rules(): array
    {
        return [
            'voice_file' => 'required|file', // 5MB max
        ];
    }

    public static function messages(): array
    {
        return [
            'voice_file.required' => 'Voice file is required',
            'voice_file.file' => 'Voice file must be a valid file',
            'voice_file.mimes' => 'Voice file must be one of: mp3, wav, ogg, m4a',
            'voice_file.max' => 'Voice file cannot exceed 5MB'
        ];
    }
}
