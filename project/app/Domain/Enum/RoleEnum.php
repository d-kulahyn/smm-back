<?php

declare(strict_types=1);

namespace App\Domain\Enum;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case CLIENT = 'client';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Администратор',
            self::CLIENT => 'Клиент',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::ADMIN => PermissionEnum::cases(),
            self::CLIENT => [
                PermissionEnum::VIEW_OWN_PROJECTS,
                PermissionEnum::VIEW_PROJECT_CHATS,
                PermissionEnum::SEND_MESSAGES,
                PermissionEnum::UPLOAD_MEDIA,
                PermissionEnum::VIEW_PROJECT_CONTENT_PLANS,
                PermissionEnum::VIEW_PROJECT_STORYBOOKS,
                PermissionEnum::VIEW_SOCIAL_ACCOUNTS,
                PermissionEnum::VIEW_PROJECT_REPORTS,
                PermissionEnum::VIEW_ANALYTICS_DASHBOARD,
            ],
        };
    }
}
