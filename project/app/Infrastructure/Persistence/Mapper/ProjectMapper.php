<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Domain\Entity\Project;
use App\Infrastructure\API\DTO\ProjectRelationsDto;
use App\Infrastructure\API\DTO\ProjectStatsDto;
use App\Models\Project as EloquentProject;

class ProjectMapper
{
    public function toEntity(EloquentProject $eloquentProject): Project
    {
        return Project::from($eloquentProject->toArray());
    }

    public function toEntityWithRelations(
        EloquentProject $eloquentProject,
        ProjectRelationsDto $projectRelationsDto
    ): Project {
        $projectEntity = $this->toEntity($eloquentProject);

        return $projectEntity
            ->setTasks($projectRelationsDto->tasksData[$eloquentProject->id] ?? [])
            ->setStats($projectRelationsDto->projectStats[$eloquentProject->id] ?? new ProjectStatsDto(
                total_tasks          : 0,
                completed_tasks      : 0,
                pending_tasks        : 0,
                overdue_tasks        : 0,
                completion_percentage: 0
            ))
            ->setMembers($projectRelationsDto->membersData[$eloquentProject->id] ?? [])
            ->setInvitations($projectRelationsDto->invitationsData[$eloquentProject->id] ?? [])
            ->setChats($projectRelationsDto->chatsData[$eloquentProject->id] ?? []);
    }
}
