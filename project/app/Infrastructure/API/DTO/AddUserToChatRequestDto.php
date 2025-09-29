<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use App\Domain\Enum\PermissionEnum;
use App\Domain\Enum\RoleEnum;
use Spatie\LaravelData\Data;

class AddUserToChatRequestDto extends Data
{
    public function __construct(
        public int $user_id,
        public ?RoleEnum $role = RoleEnum::CHAT_MEMBER,
        public array $permissions = []
    ) {}

    public static function rules(): array
    {
        return [
            'user_id'       => 'required|integer|exists:customers,id',
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|in:'.implode(',',
                    [PermissionEnum::SEND_MESSAGES, PermissionEnum::DELETE_MESSAGES]),
        ];
    }
}
