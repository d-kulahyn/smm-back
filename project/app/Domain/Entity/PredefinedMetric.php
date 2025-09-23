<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class PredefinedMetric extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $label,
        public readonly string $category,
        public readonly string $platform,
        public readonly string $type, // number, percentage, boolean
        public readonly ?string $description = null,
    ) {}

    public static function getDefaultMetrics(): array
    {
        return [
            // Instagram метрики
            new self('instagram_stories_count', 'Количество историй', 'content', 'instagram', 'number',
                'Количество опубликованных историй'),
            new self('instagram_posts_count', 'Количество постов', 'content', 'instagram', 'number',
                'Количество опубликованных постов'),
            new self('instagram_reels_count', 'Количество рилсов', 'content', 'instagram', 'number',
                'Количество опубликованных рилсов'),
            new self('instagram_followers_growth', 'Прирост подписчиков', 'audience', 'instagram', 'number',
                'Новые подписчики за период'),
            new self('instagram_engagement_rate', 'Коэффициент вовлеченности', 'engagement', 'instagram', 'percentage',
                'Средний ER за период'),

            // Facebook метрики
            new self('facebook_posts_count', 'Количество постов', 'content', 'facebook', 'number',
                'Количество опубликованных постов'),
            new self('facebook_reach', 'Охват', 'reach', 'facebook', 'number', 'Количество уникальных пользователей'),
            new self('facebook_impressions', 'Показы', 'reach', 'facebook', 'number', 'Общее количество показов'),

            // TikTok метрики
            new self('tiktok_videos_count', 'Количество видео', 'content', 'tiktok', 'number',
                'Количество опубликованных видео'),
            new self('tiktok_views', 'Просмотры', 'reach', 'tiktok', 'number', 'Общее количество просмотров'),

            // YouTube метрики
            new self('youtube_videos_count', 'Количество видео', 'content', 'youtube', 'number',
                'Количество опубликованных видео'),
            new self('youtube_watch_time', 'Время просмотра', 'engagement', 'youtube', 'number',
                'Общее время просмотра в минутах'),

            // Общие метрики
            new self('total_content_pieces', 'Общее количество контента', 'content', 'all', 'number',
                'Всего единиц контента'),
            new self('brand_mentions', 'Упоминания бренда', 'brand', 'all', 'number', 'Количество упоминаний бренда'),
            new self('campaign_budget_spent', 'Потрачено на рекламу', 'advertising', 'all', 'number',
                'Бюджет потраченный на рекламные кампании'),
        ];
    }
}
