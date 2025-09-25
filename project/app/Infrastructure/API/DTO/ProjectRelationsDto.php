<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class ProjectRelationsDto extends Data
{
    public function __construct(
        public array $projectStats,
        public array $tasksData,
        public array $membersData,
        public array $invitationsData,
        public array $chatsData,
    ) {}
}
