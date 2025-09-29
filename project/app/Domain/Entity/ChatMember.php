<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class ChatMember extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $chat_id,
        public readonly int $user_id,
        public readonly ?string $joined_at = null,
        public readonly ?string $created_at = null,
        public readonly ?string $updated_at = null,
        public ?Customer $user = null,
        public ?Chat $chat = null
    ) {}
}
