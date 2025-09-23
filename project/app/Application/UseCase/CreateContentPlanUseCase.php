<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ContentPlan;
use App\Domain\Event\ContentPlanCreatedEvent;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ContentPlanWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;

class CreateContentPlanUseCase
{
    public function __construct(
        private ContentPlanWriteRepositoryInterface $contentPlanWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(array $data): ContentPlan
    {
        // Проверяем существование проекта через исключение
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        $contentPlan = $this->contentPlanWriteRepository->create($data);

        // Отправляем событие создания контент-плана через сокеты
        event(new ContentPlanCreatedEvent($data['project_id'], $contentPlan));

        return $contentPlan;
    }
}
