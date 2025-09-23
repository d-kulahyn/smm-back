<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Project;
use App\Domain\Event\ProjectCreatedEvent;
use App\Domain\Repository\ProjectWriteRepositoryInterface;

readonly class CreateProjectUseCase
{
    public function __construct(
        private ProjectWriteRepositoryInterface $projectWriteRepository,
    ) {}

    public function execute(array $data): Project
    {
        $project = $this->projectWriteRepository->create($data);

        event(new ProjectCreatedEvent($data['customer_id'], $project));

        return $project;
    }
}
