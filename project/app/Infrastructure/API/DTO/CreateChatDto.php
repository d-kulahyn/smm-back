<?php

namespace App\Infrastructure\API\DTO;

class CreateChatDto
{
    public function __construct(
        public readonly int $project_id,
        public readonly int $customer_id,
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $status = 'active'
    ) {}

    public function getProjectId(): int
    {
        return $this->project_id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }
}
