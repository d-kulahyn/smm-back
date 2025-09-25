<?php

namespace App\Infrastructure\API\Requests;

use Spatie\LaravelData\Data;

class CreateChatRequestDto extends Data
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $status = 'active'
    ) {}

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status'      => 'nullable|string|in:active,inactive,archived',
        ];
    }
}
