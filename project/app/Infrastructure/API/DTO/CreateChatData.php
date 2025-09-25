<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateChatData extends Data
{
    public function __construct(
        public string $title,
        public ?string $description = null,
        public string $status = 'active',
    ) {}

    public static function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:active,inactive,archived'
        ];
    }

    public static function messages(): array
    {
        return [
            'title.required' => 'Chat title is required',
            'title.max' => 'Chat title cannot exceed 255 characters',
            'description.max' => 'Description cannot exceed 1000 characters',
            'status.in' => 'Status must be one of: active, inactive, archived'
        ];
    }
}
