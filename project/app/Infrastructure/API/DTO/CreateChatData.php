<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;
use App\Domain\Enum\ChatStatusEnum;

class CreateChatData extends Data
{
    public function __construct(
        public string $title,
        public ?string $description = null,
        public string $status = ChatStatusEnum::ACTIVE->value,
    ) {}

    public static function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status'      => 'nullable|string|in:'.implode(',', ChatStatusEnum::values()),
        ];
    }
}
