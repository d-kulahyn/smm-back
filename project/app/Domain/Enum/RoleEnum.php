<?php

declare(strict_types=1);

namespace App\Domain\Enum;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case PROJECT_MANAGER = 'project_manager';
    case CLIENT = 'client';
    case FREELANCER = 'freelancer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Администратор',
            self::PROJECT_MANAGER => 'Менеджер проектов',
            self::CLIENT => 'Клиент',
            self::FREELANCER => 'Фрилансер',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::ADMIN => PermissionEnum::cases(),
            self::PROJECT_MANAGER => [
                PermissionEnum::MANAGE_ASSIGNED_PROJECTS,
                PermissionEnum::MANAGE_PROJECT_TASKS,
                PermissionEnum::VIEW_PROJECT_CHATS,
                PermissionEnum::UPLOAD_MEDIA,
                PermissionEnum::CREATE_CONTENT_PLANS,
                PermissionEnum::VIEW_PROJECT_CONTENT_PLANS,
                PermissionEnum::SCHEDULE_CONTENT,
                PermissionEnum::CREATE_STORYBOOKS,
                PermissionEnum::VIEW_PROJECT_STORYBOOKS,
                PermissionEnum::ACTIVATE_STORIES,
                PermissionEnum::CONNECT_SOCIAL_ACCOUNTS,
                PermissionEnum::VIEW_SOCIAL_ACCOUNTS,
                PermissionEnum::VIEW_PROJECT_REPORTS,
                PermissionEnum::GENERATE_REPORTS,
                PermissionEnum::ADD_MANUAL_METRICS,
                PermissionEnum::VIEW_ANALYTICS_DASHBOARD,
            ],
            self::CLIENT => [
                PermissionEnum::VIEW_OWN_PROJECTS,
                PermissionEnum::CREATE_TASKS,
                PermissionEnum::VIEW_PROJECT_CHATS,
                PermissionEnum::SEND_MESSAGES,
                PermissionEnum::UPLOAD_MEDIA,
                PermissionEnum::CREATE_CONTENT_PLANS,
                PermissionEnum::VIEW_PROJECT_CONTENT_PLANS,
                PermissionEnum::CREATE_STORYBOOKS,
                PermissionEnum::VIEW_PROJECT_STORYBOOKS,
                PermissionEnum::VIEW_SOCIAL_ACCOUNTS,
                PermissionEnum::VIEW_PROJECT_REPORTS,
                PermissionEnum::ADD_MANUAL_METRICS,
                PermissionEnum::VIEW_ANALYTICS_DASHBOARD,
                PermissionEnum::CREATE_PROJECTS,
            ],
            self::FREELANCER => [
                PermissionEnum::VIEW_ASSIGNED_PROJECTS,
                PermissionEnum::VIEW_ASSIGNED_TASKS,
                PermissionEnum::UPDATE_TASK_STATUS,
                PermissionEnum::VIEW_PROJECT_CHATS,
                PermissionEnum::UPLOAD_MEDIA,
                PermissionEnum::VIEW_PROJECT_CONTENT_PLANS,
                PermissionEnum::VIEW_PROJECT_STORYBOOKS,
                PermissionEnum::VIEW_SOCIAL_ACCOUNTS,
                PermissionEnum::VIEW_PROJECT_REPORTS,
            ],
        };
    }
}
