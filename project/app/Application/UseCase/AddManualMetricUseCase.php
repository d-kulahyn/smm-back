<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\SocialMetric;
use App\Domain\Entity\PredefinedMetric;
use App\Domain\Repository\SocialMetricWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Exception\ProjectNotFoundException;

readonly class AddManualMetricUseCase
{
    public function __construct(
        private SocialMetricWriteRepositoryInterface $socialMetricWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    /**
     * @throws ProjectNotFoundException
     */
    public function execute(array $data): SocialMetric
    {
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        // Валидируем, что метрика существует в предопределенных
        $predefinedMetrics = PredefinedMetric::getDefaultMetrics();
        $metricExists = collect($predefinedMetrics)->contains(function ($metric) use ($data) {
            return $metric->name === $data['metric_name'] && $metric->platform === $data['platform'];
        });

        if (!$metricExists) {
            throw new \InvalidArgumentException('Неизвестная метрика: ' . $data['metric_name']);
        }

        $metricData = array_merge($data, [
            'is_manual' => true,
        ]);

        return $this->socialMetricWriteRepository->create($metricData);
    }

    public function getPredefinedMetrics(string $platform = 'all'): array
    {
        $allMetrics = PredefinedMetric::getDefaultMetrics();

        if ($platform === 'all') {
            return $allMetrics;
        }

        return array_filter($allMetrics, fn($metric) => $metric->platform === $platform || $metric->platform === 'all');
    }
}
