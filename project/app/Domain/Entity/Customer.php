<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Enum\RoleEnum;
use App\Domain\Enum\PermissionEnum;
use Spatie\LaravelData\Data;

class Customer extends Data
{
    public function __construct(
        public string $password,
        public string $email,
        public bool $email_notifications = true,
        public bool $push_notifications = true,
        public string $role = RoleEnum::ADMIN->value,
        public array $chats = [],
        public ?array $permissions = null,
        public ?string $firebase_cloud_messaging_token = null,
        public ?string $social_type = null,
        public ?string $social_id = null,
        public ?string $email_verified_at = null,
        public ?string $name = null,
        public ?string $avatar = null,
        public ?int $id = null,
    ) {}

    public function aMemberOfChat(int $chatId): bool
    {
        return in_array($chatId, $this->getChatsIds());
    }

    public function getChatsIds(): array
    {
        return array_map(fn($chat) => $chat->id, $this->chats);
    }

    public function getRole(): RoleEnum
    {
        return RoleEnum::from($this->role);
    }

    public function hasPermission(PermissionEnum $permission): bool
    {
        $rolePermissions = $this->getRole()->permissions();

        if (in_array($permission, $rolePermissions)) {
            return true;
        }

        if ($this->permissions && in_array($permission->value, $this->permissions)) {
            return true;
        }

        return false;
    }

    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }

    public function isAdmin(): bool
    {
        return $this->getRole() === RoleEnum::ADMIN;
    }

    public function isClient(): bool
    {
        return $this->getRole() === RoleEnum::CLIENT;
    }
}
