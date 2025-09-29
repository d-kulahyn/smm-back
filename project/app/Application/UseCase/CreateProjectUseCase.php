<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Project;
use App\Infrastructure\API\DTO\CreateProjectDto;
use App\Domain\Repository\ProjectWriteRepositoryInterface;

readonly class CreateProjectUseCase
{
    public function __construct(
        private ProjectWriteRepositoryInterface $projectWriteRepository,
    ) {}

    public function execute(CreateProjectDto $data): Project
    {
        return $this->projectWriteRepository->create($data);
    }
}
