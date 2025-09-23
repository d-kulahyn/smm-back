<?php

namespace App\Infrastructure\API\DTO;

use Illuminate\Http\Request;

readonly class PaginationParamsDto
{
    public function __construct(
        public int $page = 1,
        public int $perPage = 10,
        public int $tasksLimit = 5
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            page      : (int)$request->get('page', 1),
            perPage   : (int)$request->get('per_page', 10),
            tasksLimit: (int)$request->get('tasks_limit', 5)
        );
    }

    public function toArray(): array
    {
        return [
            'page'        => $this->page,
            'per_page'    => $this->perPage,
            'tasks_limit' => $this->tasksLimit,
        ];
    }
}
