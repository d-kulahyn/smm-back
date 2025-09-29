<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectReport;
use App\Domain\Repository\ProjectReportWriteRepositoryInterface;
use App\Domain\Repository\SocialMediaAccountReadRepositoryInterface;
use App\Domain\Repository\ContentPlanReadRepositoryInterface;
use App\Domain\Repository\StorybookReadRepositoryInterface;
use App\Domain\Enum\StorybookStatusEnum;

class GenerateAutomaticReportUseCase
{
    public function __construct(
        private ProjectReportWriteRepositoryInterface $projectReportWriteRepository,
        private SocialMediaAccountReadRepositoryInterface $socialMediaAccountReadRepository,
        private ContentPlanReadRepositoryInterface $contentPlanReadRepository,
        private StorybookReadRepositoryInterface $storybookReadRepository
    ) {}

    public function execute(int $projectId, string $periodType = 'monthly'): ProjectReport
    {
        $reportDate = now()->toDateString();

        // Получаем автоматические метрики
        $automatedMetrics = $this->collectAutomatedMetrics($projectId);

        // Получаем внутренние метрики проекта
        $internalMetrics = $this->collectInternalMetrics($projectId);

        // Создаем сводные данные
        $summaryData = $this->generateSummaryData($automatedMetrics, $internalMetrics);

        $reportData = [
            'project_id'        => $projectId,
            'report_date'       => $reportDate,
            'period_type'       => $periodType,
            'automated_metrics' => $automatedMetrics,
            'social_metrics'    => $internalMetrics,
            'summary_data'      => $summaryData,
            'is_generated'      => true,
            'generated_at'      => now(),
        ];

        return $this->projectReportWriteRepository->create($reportData);
    }

    private function collectAutomatedMetrics(int $projectId): array
    {
        $metrics = [];
        $socialAccounts = $this->socialMediaAccountReadRepository->findActiveAccounts($projectId);

        foreach ($socialAccounts as $account) {
            if ($account->isConnected() && !$account->isTokenExpired()) {
                $platformMetrics = $this->fetchMetricsFromAPI($account);
                $metrics[$account->platform] = $platformMetrics;
            }
        }

        return $metrics;
    }

    private function collectInternalMetrics(int $projectId): array
    {
        $startDate = now()->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        // Метрики контент-планов
        $contentPlans = $this->contentPlanReadRepository->getContentCalendar($projectId, $startDate, $endDate);
        $publishedContent = $contentPlans->where('status', 'published')->count();
        $scheduledContent = $contentPlans->where('status', 'scheduled')->count();

        // Метрики сторибука
        $storybooks = $this->storybookReadRepository->findByProjectId($projectId);
        $activeStories = $storybooks->where('status', 'active')->count();
        $totalStories = $storybooks->count();

        return [
            'content_plans' => [
                'published_count' => $publishedContent,
                'scheduled_count' => $scheduledContent,
                'total_count'     => $contentPlans->count(),
            ],
            'storybooks'    => [
                'active_count'  => $activeStories,
                'total_count'   => $totalStories,
                'expired_count' => $storybooks->where('status', StorybookStatusEnum::EXPIRED->value)->count(),
            ],
        ];
    }

    private function fetchMetricsFromAPI($account): array
    {
        // Здесь будет логика получения метрик из API соответствующей платформы
        // В зависимости от платформы вызываем соответствующий сервис

        return match ($account->platform) {
            'instagram' => $this->fetchInstagramMetrics($account),
            'facebook' => $this->fetchFacebookMetrics($account),
            'tiktok' => $this->fetchTikTokMetrics($account),
            'youtube' => $this->fetchYouTubeMetrics($account),
            default => []
        };
    }

    private function fetchInstagramMetrics($account): array
    {
        // Здесь будет интеграция с Instagram Graph API
        // Пока возвращаем заглушку
        return [
            'followers_count' => 0,
            'posts_count'     => 0,
            'stories_count'   => 0,
            'reach'           => 0,
            'impressions'     => 0,
            'likes'           => 0,
            'comments'        => 0,
            'shares'          => 0,
            'saves'           => 0,
        ];
    }

    private function fetchFacebookMetrics($account): array
    {
        // Здесь будет интеграция с Facebook Graph API
        return [
            'page_likes'  => 0,
            'posts_count' => 0,
            'reach'       => 0,
            'impressions' => 0,
            'engagement'  => 0,
        ];
    }

    private function fetchTikTokMetrics($account): array
    {
        // Здесь будет интеграция с TikTok Business API
        return [
            'followers_count' => 0,
            'videos_count'    => 0,
            'views'           => 0,
            'likes'           => 0,
            'shares'          => 0,
        ];
    }

    private function fetchYouTubeMetrics($account): array
    {
        // Здесь будет интеграция с YouTube Data API
        return [
            'subscribers_count'  => 0,
            'videos_count'       => 0,
            'views'              => 0,
            'watch_time_minutes' => 0,
            'likes'              => 0,
            'comments'           => 0,
        ];
    }

    private function generateSummaryData(array $automatedMetrics, array $internalMetrics): array
    {
        $totalReach = 0;
        $totalEngagement = 0;

        // Суммируем автоматические метрики
        foreach ($automatedMetrics as $platform => $metrics) {
            $totalReach += $metrics['reach'] ?? $metrics['views'] ?? 0;
            $totalEngagement += ($metrics['likes'] ?? 0) + ($metrics['comments'] ?? 0) + ($metrics['shares'] ?? 0);
        }

        // Суммируем внутренние метрики
        $totalContentPieces = ($internalMetrics['content_plans']['total_count'] ?? 0) +
            ($internalMetrics['storybooks']['total_count'] ?? 0);

        return [
            'total_reach'          => $totalReach,
            'total_engagement'     => $totalEngagement,
            'engagement_rate'      => $totalReach > 0 ? round(($totalEngagement / $totalReach) * 100, 2) : 0,
            'total_content_pieces' => $totalContentPieces,
            'published_content'    => $internalMetrics['content_plans']['published_count'] ?? 0,
            'active_stories'       => $internalMetrics['storybooks']['active_count'] ?? 0,
        ];
    }
}
