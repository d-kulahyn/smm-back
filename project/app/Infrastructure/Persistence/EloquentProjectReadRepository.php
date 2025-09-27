<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Project;
use App\Domain\Entity\Task;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Infrastructure\API\DTO\ProjectRelationsDto;
use App\Infrastructure\API\DTO\ProjectStatsDto;
use App\Infrastructure\Persistence\Mapper\ChatMapper;
use App\Infrastructure\Persistence\Mapper\ProjectInvitationMapper;
use App\Infrastructure\Persistence\Mapper\ProjectMapper;
use App\Infrastructure\Persistence\Mapper\ProjectMemberMapper;
use App\Models\Chat;
use App\Models\Project as ProjectModel;
use App\Models\ProjectInvitation;
use App\Models\ProjectMember;
use App\Models\Task as TaskModel;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Pagination;

readonly class EloquentProjectReadRepository implements ProjectReadRepositoryInterface
{
    public function __construct(
        private ChatMapper $chatMapper,
        private ProjectMapper $projectMapper,
        private ProjectMemberMapper $projectMemberMapper,
        private ProjectInvitationMapper $projectInvitationMapper,
    ) {}

    public function findById(int $id, int $taskCount = 5): ?Project
    {
        $model = ProjectModel::find($id);

        if (!$model) {
            return null;
        }

        return $this->projectMapper->toEntityWithRelations($model, $this->getProjectRelations([$id], $taskCount));
    }

    public function findByCustomerIdPaginated(int $customerId, int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        $projectsPaginated = ProjectModel::where(function ($query) use ($customerId) {
            $query->where('customer_id', $customerId)
                ->orWhereHas('members', function ($memberQuery) use ($customerId) {
                    $memberQuery->where('user_id', $customerId);
                });
        })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $projectIds = array_column($projectsPaginated->items(), 'id');

        $result = array_map(
            fn($project) => $this->projectMapper->toEntityWithRelations($project,
                $this->getProjectRelations($projectIds, $perPage)),
            $projectsPaginated->items()
        );

        return new Pagination($result, $projectsPaginated->total(), $perPage, $page);
    }

    public function getProjectsStats(array $projectIds): array
    {
        if (empty($projectIds)) {
            return [];
        }

        return TaskModel::selectRaw("
            project_id,
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
            SUM(CASE WHEN due_date < NOW() AND status NOT IN ('completed', 'cancelled') THEN 1 ELSE 0 END) as overdue_tasks
        ")
            ->whereIn('project_id', $projectIds)
            ->groupBy('project_id')
            ->get()
            ->mapWithKeys(fn($item) => [
                $item->project_id => ProjectStatsDto::create(
                    totalTasks    : (int)$item->total_tasks,
                    completedTasks: (int)$item->completed_tasks,
                    pendingTasks  : (int)$item->pending_tasks,
                    overdueTasks  : (int)$item->overdue_tasks
                ),
            ])->all();
    }

    public function exists(int $id): bool
    {
        return ProjectModel::where('id', $id)->exists();
    }

    public function getMultipleProjectsTasks(array $projectIds, int $limit = 5): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $tasks = TaskModel::whereIn('project_id', $projectIds)
            ->orderBy('created_at', 'desc')
            ->orderBy('priority', 'desc')
            ->get()
            ->groupBy('project_id');

        return $this->mapDataByProjectIds($projectIds, $tasks, function ($projectTasks) use ($limit) {
            return $projectTasks->take($limit)
                ->map(fn($task) => Task::from($task->toArray()))
                ->all();
        });
    }

    public function getProjectMembers(array $projectIds, int $limit = 5): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $members = ProjectMember::with('user')
            ->whereIn('project_id', $projectIds)
            ->get()
            ->groupBy('project_id');

        return $this->mapDataByProjectIds($projectIds, $members,
            fn($projectMembers) => $projectMembers->take($limit)->map(fn($member
            ) => $this->projectMemberMapper->toDomain($member))->all());
    }

    public function getProjectInvitations(array $projectIds, int $limit = 5): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $invitations = ProjectInvitation::with(['invitedBy', 'invitedUser'])
            ->whereIn('project_id', $projectIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('project_id');

        return $this->mapDataByProjectIds($projectIds, $invitations,
            fn($projectInvitations) => $projectInvitations->take($limit)->map(fn($invitation
            ) => $this->projectInvitationMapper->toDomain($invitation))->all());
    }

    public function getProjectChats(array $projectIds, int $limit = 10): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $chats = Chat::with('customer')
            ->whereIn('project_id', $projectIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('project_id');

        return $this->mapDataByProjectIds($projectIds, $chats, function ($projectChats) use ($limit) {
            return $projectChats->take($limit)
                ->map(fn($chat) => $this->chatMapper->toDomain($chat))
                ->all();
        });
    }

    private function getProjectRelations(array $projectIds, int $count = 5): ProjectRelationsDto
    {
        return new ProjectRelationsDto(
            projectStats   : $this->getProjectsStats($projectIds),
            tasksData      : $this->getMultipleProjectsTasks($projectIds, $count),
            membersData    : $this->getProjectMembers($projectIds),
            invitationsData: $this->getProjectInvitations($projectIds),
            chatsData      : $this->getProjectChats($projectIds, $count)
        );
    }

    private function mapDataByProjectIds(array $projectIds, Collection $groupedData, callable $mapper): array
    {
        $result = [];
        foreach ($projectIds as $projectId) {
            $data = $groupedData->get($projectId, collect());
            $result[$projectId] = $mapper($data);
        }

        return $result;
    }
}
