<?php

namespace App\Infrastructure\API\DTO;

use App\Domain\Enum\ChatStatusEnum;
use Spatie\LaravelData\Data;

class CreateChatDto extends Data
{
    public function __construct(
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $status = ChatStatusEnum::ACTIVE->value
    ) {}
}
