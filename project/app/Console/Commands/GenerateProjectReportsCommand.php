<?php

namespace App\Console\Commands;

use App\Application\UseCase\GenerateAutomaticReportUseCase;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\SocialMediaAccountReadRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateProjectReportsCommand extends Command
{
    protected $signature = 'reports:generate {--project_id=} {--period=monthly}';
    protected $description = 'Генерация автоматических отчетов по проектам';

    public function __construct(
        private GenerateAutomaticReportUseCase $generateAutomaticReportUseCase,
        private ProjectReadRepositoryInterface $projectReadRepository,
        private SocialMediaAccountReadRepositoryInterface $socialMediaAccountReadRepository
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Начинаем генерацию отчетов...');

        $projectId = $this->option('project_id');
        $period = $this->option('period');

        if ($projectId) {
            // Генерируем отчет для конкретного проекта
            $this->generateReportForProject((int)$projectId, $period);
        } else {
            // Генерируем отчеты для всех активных проектов
            $this->generateReportsForAllProjects($period);
        }

        $this->info('Генерация отчетов завершена!');

        return Command::SUCCESS;
    }

    private function generateReportForProject(int $projectId, string $period): void
    {
        try {
            // Проверяем, есть ли подключенные социальные аккаунты
            $connectedAccounts = $this->socialMediaAccountReadRepository->findActiveAccounts($projectId);

            if ($connectedAccounts->isEmpty()) {
                $this->warn("Проект ID {$projectId}: нет подключенных социальных аккаунтов");
                return;
            }

            $report = $this->generateAutomaticReportUseCase->execute($projectId, $period);

            $this->line("✅ Отчет сгенерирован для проекта ID {$projectId}");
            $this->line("   Охват: {$report->getTotalReach()}");
            $this->line("   Вовлеченность: {$report->getTotalEngagement()}");
            $this->line("   ER: {$report->getEngagementRate()}%");

            Log::info('Project report generated', [
                'project_id' => $projectId,
                'report_id' => $report->id,
                'period' => $period,
            ]);

        } catch (\Exception $e) {
            $this->error("Ошибка при генерации отчета для проекта {$projectId}: {$e->getMessage()}");

            Log::error('Failed to generate project report', [
                'project_id' => $projectId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function generateReportsForAllProjects(string $period): void
    {
        // Получаем все активные проекты с подключенными социальными аккаунтами
        $projectsWithSocialAccounts = \App\Models\Project::whereHas('socialMediaAccounts', function ($query) {
            $query->where('is_active', true);
        })->where('status', 'active')->get();

        $processedCount = 0;

        foreach ($projectsWithSocialAccounts as $project) {
            $this->generateReportForProject($project->id, $period);
            $processedCount++;
        }

        $this->info("Обработано проектов: {$processedCount}");
    }
}
