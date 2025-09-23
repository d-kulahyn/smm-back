<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Storybook;
use App\Domain\Event\StorybookCreatedEvent;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\StorybookWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;

class CreateStorybookUseCase
{
    public function __construct(
        private StorybookWriteRepositoryInterface $storybookWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(array $data): Storybook
    {
        // Проверяем существование проекта через исключение
        if (!$this->projectReadRepository->exists($data['project_id'])) {
            throw new ProjectNotFoundException();
        }

        $storybook = $this->storybookWriteRepository->create($data);

        // Отправляем событие создания сторибука через сокеты
        event(new StorybookCreatedEvent($data['project_id'], $storybook));

        return $storybook;
    }
}
