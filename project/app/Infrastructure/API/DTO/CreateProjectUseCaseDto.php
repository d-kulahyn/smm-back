<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateProjectUseCaseDto extends Data
{
    public function __construct(
        public string $name,
        public int $customer_id,
        public string $status,
        public ?string $description = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?float $budget = null,
    ) {}

    public static function fromCreateProjectDto(CreateProjectDto $dto, int $customerId): self
    {
        return new self(
            name       : $dto->name,
            customer_id: $customerId,
            status     : $dto->status,
            description: $dto->description,
            start_date : $dto->start_date,
            end_date   : $dto->end_date,
            budget     : $dto->budget
        );
    }
}
