<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class RemoveUserFromChatDto extends Data
{
    public function __construct(
        public int $user_id
    ) {}

    public static function rules(): array
    {
        return [
            'user_id' => 'required|exists:customers,id',
        ];
    }
}
