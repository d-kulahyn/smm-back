<?php

declare(strict_types=1);

namespace App\Domain\Enum;

enum PermissionEnum: string
{
    // Управление проектами
    case MANAGE_ALL_PROJECTS = 'manage_all_projects';
    case MANAGE_ASSIGNED_PROJECTS = 'manage_assigned_projects';
    case VIEW_OWN_PROJECTS = 'view_own_projects';
    case VIEW_ASSIGNED_PROJECTS = 'view_assigned_projects';
    case CREATE_PROJECTS = 'create_projects';
    case DELETE_PROJECTS = 'delete_projects';

    // Управление задачами
    case MANAGE_ALL_TASKS = 'manage_all_tasks';
    case MANAGE_PROJECT_TASKS = 'manage_project_tasks';
    case VIEW_ASSIGNED_TASKS = 'view_assigned_tasks';
    case CREATE_TASKS = 'create_tasks';
    case UPDATE_TASK_STATUS = 'update_task_status';
    case DELETE_TASKS = 'delete_tasks';

    // Управление чатами
    case MANAGE_ALL_CHATS = 'manage_all_chats';
    case VIEW_PROJECT_CHATS = 'view_project_chats';
    case SEND_MESSAGES = 'send_messages';
    case DELETE_MESSAGES = 'delete_messages';

    // Управление медиафайлами
    case VIEW_ALL_MEDIA = 'view_all_media';
    case UPLOAD_MEDIA = 'upload_media';
    case DELETE_ANY_MEDIA = 'delete_any_media';
    case DELETE_OWN_MEDIA = 'delete_own_media';

    // Управление контент-планами
    case MANAGE_ALL_CONTENT_PLANS = 'manage_all_content_plans';
    case CREATE_CONTENT_PLANS = 'create_content_plans';
    case VIEW_PROJECT_CONTENT_PLANS = 'view_project_content_plans';
    case SCHEDULE_CONTENT = 'schedule_content';
    case APPROVE_CONTENT = 'approve_content';

    // Управление сторибуком
    case MANAGE_ALL_STORYBOOKS = 'manage_all_storybooks';
    case CREATE_STORYBOOKS = 'create_storybooks';
    case VIEW_PROJECT_STORYBOOKS = 'view_project_storybooks';
    case ACTIVATE_STORIES = 'activate_stories';

    // Управление социальными аккаунтами
    case MANAGE_SOCIAL_ACCOUNTS = 'manage_social_accounts';
    case CONNECT_SOCIAL_ACCOUNTS = 'connect_social_accounts';
    case VIEW_SOCIAL_ACCOUNTS = 'view_social_accounts';
    case DISCONNECT_SOCIAL_ACCOUNTS = 'disconnect_social_accounts';

    // Управление отчетностью и аналитикой
    case VIEW_ALL_REPORTS = 'view_all_reports';
    case VIEW_PROJECT_REPORTS = 'view_project_reports';
    case GENERATE_REPORTS = 'generate_reports';
    case ADD_MANUAL_METRICS = 'add_manual_metrics';
    case VIEW_ANALYTICS_DASHBOARD = 'view_analytics_dashboard';

    // Управление пользователями
    case MANAGE_USERS = 'manage_users';
    case VIEW_USER_PROFILES = 'view_user_profiles';

    // Управление проектными приглашениями
    case MANAGE_ALL_PROJECT_INVITATIONS = 'manage_all_project_invitations';
    case SEND_PROJECT_INVITATIONS = 'send_project_invitations';
    case VIEW_PROJECT_INVITATIONS = 'view_project_invitations';
    case ACCEPT_PROJECT_INVITATIONS = 'accept_project_invitations';
    case DECLINE_PROJECT_INVITATIONS = 'decline_project_invite';

    public function label(): string
    {
        return match ($this) {
            self::MANAGE_ALL_PROJECTS => 'Управление всеми проектами',
            self::MANAGE_ASSIGNED_PROJECTS => 'Управление назначенными проектами',
            self::VIEW_OWN_PROJECTS => 'Просмотр собственных проектов',
            self::VIEW_ASSIGNED_PROJECTS => 'Просмотр назначенных проектов',
            self::CREATE_PROJECTS => 'Создание проектов',
            self::DELETE_PROJECTS => 'Удаление проектов',

            self::MANAGE_ALL_TASKS => 'Управление всеми задачами',
            self::MANAGE_PROJECT_TASKS => 'Управление задачами проекта',
            self::VIEW_ASSIGNED_TASKS => 'Просмотр назначенных задач',
            self::CREATE_TASKS => 'Создание задач',
            self::UPDATE_TASK_STATUS => 'Обновление статуса задач',
            self::DELETE_TASKS => 'Удаление задач',

            self::MANAGE_ALL_CHATS => 'Управление всеми чатами',
            self::VIEW_PROJECT_CHATS => 'Просмотр чатов проекта',
            self::SEND_MESSAGES => 'Отправка сообщений',
            self::DELETE_MESSAGES => 'Удаление сообщений',

            self::VIEW_ALL_MEDIA => 'Просмотр всех медиафайлов',
            self::UPLOAD_MEDIA => 'Загрузка медиафайлов',
            self::DELETE_ANY_MEDIA => 'Удаление любых медиафайлов',
            self::DELETE_OWN_MEDIA => 'Удаление собственных медиафайлов',

            self::MANAGE_ALL_CONTENT_PLANS => 'Управление всеми контент-планами',
            self::CREATE_CONTENT_PLANS => 'Создание контент-планов',
            self::VIEW_PROJECT_CONTENT_PLANS => 'Просмотр контент-планов проекта',
            self::SCHEDULE_CONTENT => 'Планирование контента',
            self::APPROVE_CONTENT => 'Одобрение контента',

            self::MANAGE_ALL_STORYBOOKS => 'Управление всеми сторибуками',
            self::CREATE_STORYBOOKS => 'Создание сторибуков',
            self::VIEW_PROJECT_STORYBOOKS => 'Просмотр сторибуков проекта',
            self::ACTIVATE_STORIES => 'Активация историй',

            self::MANAGE_SOCIAL_ACCOUNTS => 'Управление социальными аккаунтами',
            self::CONNECT_SOCIAL_ACCOUNTS => 'Подключение социальных аккаунтов',
            self::VIEW_SOCIAL_ACCOUNTS => 'Просмотр социальных аккаунтов',
            self::DISCONNECT_SOCIAL_ACCOUNTS => 'Отключение социальных аккаунтов',

            self::VIEW_ALL_REPORTS => 'Просмотр всех отчетов',
            self::VIEW_PROJECT_REPORTS => 'Просмотр отчетов проекта',
            self::GENERATE_REPORTS => 'Генерация отчетов',
            self::ADD_MANUAL_METRICS => 'Добавление ручных метрик',
            self::VIEW_ANALYTICS_DASHBOARD => 'Просмотр аналитической панели',

            self::MANAGE_USERS => 'Управление пользователями',
            self::VIEW_USER_PROFILES => 'Просмотр профилей пользователей',

            self::MANAGE_ALL_PROJECT_INVITATIONS => 'Управление всеми приглашениями в проекте',
            self::SEND_PROJECT_INVITATIONS => 'Отправка приглашений в проект',
            self::VIEW_PROJECT_INVITATIONS => 'Просмотр приглашений в проект',
            self::ACCEPT_PROJECT_INVITATIONS => 'Принятие приглашений в проекте',
            self::DECLINE_PROJECT_INVITATIONS => 'Отклонение приглашений в проекте'
        };
    }
}


