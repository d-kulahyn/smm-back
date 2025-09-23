<?php

namespace App\Infrastructure\API\DTO;

class TasksDataDto
{
    public function __construct(
        public readonly array $data,
        public readonly int $currentPage = 1,
        public readonly int $lastPage = 1,
        public readonly int $perPage = 0,
        public readonly int $total = 0
    ) {}

    public static function fromArray(array $tasks, int $totalTasks = 0): self
    {
        return new self(
            data       : $tasks,
            currentPage: 1,
            lastPage   : 1,
            perPage    : count($tasks),
            total      : $totalTasks
        );
    }

    public function toArray(): array
    {
        return [
            'data'         => $this->data,
            'current_page' => $this->currentPage,
            'last_page'    => $this->lastPage,
            'per_page'     => $this->perPage,
            'total'        => $this->total,
        ];
    }

    public function isEmpty(): bool
    {
        return empty($this->data);
    }
}
