<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateProjectDto extends Data
{
    public function __construct(
        public string $name,
        public int $customer_id,
        public string $status,
        public ?string $avatar = null,
        public ?string $description = null,
        public ?string $color = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?float $budget = null,
    ) {}
}
