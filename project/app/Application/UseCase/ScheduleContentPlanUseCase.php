<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ContentPlan;
use App\Domain\Event\ContentPlanScheduledEvent;
use App\Domain\Repository\ContentPlanWriteRepositoryInterface;
use App\Domain\Repository\ContentPlanReadRepositoryInterface;

class ScheduleContentPlanUseCase
{
    public function __construct(
        private ContentPlanWriteRepositoryInterface $contentPlanWriteRepository,
        private ContentPlanReadRepositoryInterface $contentPlanReadRepository
    ) {}

    public function execute(int $contentPlanId, string $scheduledDate): ContentPlan
    {
        $existingContentPlan = $this->contentPlanReadRepository->findById($contentPlanId);

        if (!$existingContentPlan) {
            throw new \App\Domain\Exception\ContentPlanNotFoundException();
        }

        $contentPlan = $this->contentPlanWriteRepository->scheduleContent($contentPlanId, $scheduledDate);

        // Отправляем событие планирования контента через сокеты
        event(new ContentPlanScheduledEvent($contentPlan->project_id, $contentPlan));

        return $contentPlan;
    }
}
