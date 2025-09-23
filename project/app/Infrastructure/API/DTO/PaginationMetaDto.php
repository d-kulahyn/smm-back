<?php

namespace App\Infrastructure\API\DTO;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaginationMetaDto
{
    public function __construct(
        public readonly int $currentPage,
        public readonly int $lastPage,
        public readonly int $perPage,
        public readonly int $total,
        public readonly ?int $from = null,
        public readonly ?int $to = null
    ) {}

    public static function fromPaginator(LengthAwarePaginator $paginated): self
    {
        return new self(
            currentPage: $paginated->currentPage(),
            lastPage   : $paginated->lastPage(),
            perPage    : $paginated->perPage(),
            total      : $paginated->total(),
        );
    }

    public function toArray(): array
    {
        return [
            'current_page' => $this->currentPage,
            'last_page'    => $this->lastPage,
            'per_page'     => $this->perPage,
            'total'        => $this->total,
        ];
    }
}
