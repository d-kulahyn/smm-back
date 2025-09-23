<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class UpdateProjectUseCaseDto extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $description = null,
        public ?string $status = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?float $budget = null,
    ) {}

    public static function fromCreateProjectDto(CreateProjectDto $dto): self
    {
        return new self(
            name       : $dto->name,
            description: $dto->description,
            status     : $dto->status,
            start_date : $dto->start_date,
            end_date   : $dto->end_date,
            budget     : $dto->budget
        );
    }
}
