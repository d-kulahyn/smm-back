<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Project;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ProjectWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;

readonly class UpdateProjectUseCase
{
    public function __construct(
        private ProjectWriteRepositoryInterface $projectWriteRepository,
        private ProjectReadRepositoryInterface $projectReadRepository
    ) {}

    public function execute(int $projectId, array $data): Project
    {
        if (!$this->projectReadRepository->exists($projectId)) {
            throw new ProjectNotFoundException();
        }

        return $this->projectWriteRepository->update($projectId, $data);
    }
}
