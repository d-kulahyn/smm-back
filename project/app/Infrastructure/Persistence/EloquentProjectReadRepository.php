<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Project;
use App\Domain\Entity\Task;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Infrastructure\API\DTO\TasksStatsDto;
use App\Models\Project as ProjectModel;
use App\Models\Task as TaskModel;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Pagination;

class EloquentProjectReadRepository implements ProjectReadRepositoryInterface
{
    public function findById(int $id, int $taskCount = 5): ?Project
    {
        $model = ProjectModel::with(['members.user', 'invitations.invitedBy', 'invitations.invitedUser', 'chats.customer'])->find($id);

        $tasksStats = $this->getMultipleProjectsTasksCount([$id]);
        $tasksData = $this->getMultipleProjectsTasks([$id], $taskCount);
        $membersData = $model ? $this->getProjectMembers([$id]) : [];
        $invitationsData = $model ? $this->getProjectInvitations([$id]) : [];
        $chatsData = $model ? $this->getProjectChats([$id]) : [];

        $projectEntity = $model ? Project::from($model->toArray()) : null;
        $projectEntity?->setTasks($tasksData[$id] ?? [])
                     ->setStats($tasksStats[$id] ?? [])
                     ->setMembers($membersData[$id] ?? [])
                     ->setInvitations($invitationsData[$id] ?? [])
                     ->setChats($chatsData[$id] ?? []);

        return $projectEntity;
    }

    public function findByCustomerId(int $customerId): Collection
    {
        $models = ProjectModel::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => Project::from($model->toArray()));
    }

    public function findByCustomerIdPaginated(int $customerId, int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        return ProjectModel::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByStatus(string $status): Collection
    {
        $models = ProjectModel::where('status', $status)->get();

        return $models->map(fn($model) => Project::from($model->toArray()));
    }

    public function getProjectStats(int $projectId): array
    {
        $project = ProjectModel::with(['tasks'])->find($projectId);

        if (!$project) {
            return [];
        }

        $totalTasks = $project->tasks->count();
        $completedTasks = $project->tasks->where('status', 'completed')->count();
        $pendingTasks = $project->tasks->where('status', 'pending')->count();
        $overdueTasks = $project->tasks
            ->where('due_date', '<', now())
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->count();

        return [
            'total_tasks'           => $totalTasks,
            'completed_tasks'       => $completedTasks,
            'pending_tasks'         => $pendingTasks,
            'overdue_tasks'         => $overdueTasks,
            'completion_percentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0,
        ];
    }

    public function exists(int $id): bool
    {
        return ProjectModel::where('id', $id)->exists();
    }

    public function getProjectTasks(int $projectId, int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        return TaskModel::where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->orderBy('priority', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getProjectTasksCount(int $projectId): array
    {
        $totalTasks = TaskModel::where('project_id', $projectId)->count();
        $completedTasks = TaskModel::where('project_id', $projectId)
            ->where('status', 'completed')
            ->count();
        $pendingTasks = TaskModel::where('project_id', $projectId)
            ->where('status', 'pending')
            ->count();
        $overdueTasks = TaskModel::where('project_id', $projectId)
            ->where('due_date', '<', now())
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->count();

        return [
            'total_tasks'           => $totalTasks,
            'completed_tasks'       => $completedTasks,
            'pending_tasks'         => $pendingTasks,
            'overdue_tasks'         => $overdueTasks,
            'completion_percentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0,
        ];
    }

    public function getMultipleProjectsTasksCount(array $projectIds): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $tasksStats = TaskModel::selectRaw("
            project_id,
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
            SUM(CASE WHEN due_date < NOW() AND status NOT IN ('completed', 'cancelled') THEN 1 ELSE 0 END) as overdue_tasks
        ")
            ->whereIn('project_id', $projectIds)
            ->groupBy('project_id')
            ->get()
            ->keyBy('project_id');

        $result = [];
        foreach ($projectIds as $projectId) {
            $stats = $tasksStats->get($projectId);
            if ($stats) {
                $totalTasks = $stats->total_tasks;
                $completedTasks = $stats->completed_tasks;
                $result[$projectId] = TasksStatsDto::fromArray([
                    'total_tasks'           => $totalTasks,
                    'completed_tasks'       => $completedTasks,
                    'pending_tasks'         => $stats->pending_tasks,
                    'overdue_tasks'         => $stats->overdue_tasks,
                    'completion_percentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0,
                ]);

                continue;
            }

            $result[$projectId] = TasksStatsDto::fromArray([
                'total_tasks'           => 0,
                'completed_tasks'       => 0,
                'pending_tasks'         => 0,
                'overdue_tasks'         => 0,
                'completion_percentage' => 0,
            ]);
        }

        return $result;
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

        $result = [];
        foreach ($projectIds as $projectId) {
            $projectTasks = $tasks->get($projectId, collect());

            foreach ($projectTasks->take($limit)->toArray() as $projectTask) {
                $result[$projectId][] = Task::from($projectTask);
            }
        }

        return $result;
    }

    public function findByCustomerIdPaginatedWithStats(
        int $customerId,
        int $page = 1,
        int $perPage = 10
    ): LengthAwarePaginator {
        $projectsPaginated = $this->findByCustomerIdPaginated($customerId, $page, $perPage);

        $projectIds = array_column($projectsPaginated->items(), 'id');

        $tasksStats = $this->getMultipleProjectsTasksCount($projectIds);
        $tasksData = $this->getMultipleProjectsTasks($projectIds, $perPage);
        $invitationsData = $this->getProjectInvitations($projectIds);
        $chatsData = $this->getProjectChats($projectIds, 5); // Ограничиваем 5 последними сообщениями

        $result = array_map(function ($project) use ($tasksStats, $tasksData, $invitationsData, $chatsData) {
            return Project::from($project->toArray())
                ->setTasks($tasksData[$project->id] ?? [])
                ->setStats($tasksStats[$project->id] ?? [])
                ->setInvitations($invitationsData[$project->id] ?? [])
                ->setChats($chatsData[$project->id] ?? []);
        }, $projectsPaginated->items());

        return new Pagination($result, $projectsPaginated->total(), $perPage, $page);
    }

    public function getProjectMembers(array $projectIds): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $members = \App\Models\ProjectMember::with('user')
            ->whereIn('project_id', $projectIds)
            ->get()
            ->groupBy('project_id');

        $result = [];
        foreach ($projectIds as $projectId) {
            $projectMembers = $members->get($projectId, collect());
            $result[$projectId] = $projectMembers->map(function ($member) {
                return \App\Domain\Entity\ProjectMember::from([
                    'id' => $member->id,
                    'project_id' => $member->project_id,
                    'user_id' => $member->user_id,
                    'role' => $member->role,
                    'permissions' => $member->permissions ?? [],
                    'joined_at' => $member->joined_at?->toISOString(),
                    'created_at' => $member->created_at?->toISOString(),
                    'updated_at' => $member->updated_at?->toISOString(),
                    'user' => $member->user ? \App\Domain\Entity\Customer::from($member->user->toArray()) : null
                ]);
            })->toArray();
        }

        return $result;
    }

    public function getProjectInvitations(array $projectIds): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $invitations = \App\Models\ProjectInvitation::with(['invitedBy', 'invitedUser'])
            ->whereIn('project_id', $projectIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('project_id');

        $result = [];
        foreach ($projectIds as $projectId) {
            $projectInvitations = $invitations->get($projectId, collect());
            $result[$projectId] = $projectInvitations->map(function ($invitation) {
                return \App\Domain\Entity\ProjectInvitation::from([
                    'id' => $invitation->id,
                    'project_id' => $invitation->project_id,
                    'invited_by' => $invitation->invited_by,
                    'invited_user_id' => $invitation->invited_user_id,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'permissions' => $invitation->permissions ?? [],
                    'status' => $invitation->status,
                    'token' => $invitation->token,
                    'expires_at' => $invitation->expires_at?->toISOString(),
                    'accepted_at' => $invitation->accepted_at?->toISOString(),
                    'declined_at' => $invitation->declined_at?->toISOString(),
                    'created_at' => $invitation->created_at?->toISOString(),
                    'updated_at' => $invitation->updated_at?->toISOString(),
                    'project' => null, // Избегаем циклической зависимости
                    'invitedBy' => $invitation->invitedBy ? \App\Domain\Entity\Customer::from($invitation->invitedBy->toArray()) : null,
                    'invitedUser' => $invitation->invitedUser ? \App\Domain\Entity\Customer::from($invitation->invitedUser->toArray()) : null
                ]);
            })->toArray();
        }

        return $result;
    }

    public function getProjectChats(array $projectIds, int $limit = 10): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $chats = \App\Models\Chat::with('customer')
            ->whereIn('project_id', $projectIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('project_id');

        $result = [];
        foreach ($projectIds as $projectId) {
            $projectChats = $chats->get($projectId, collect());
            $result[$projectId] = $projectChats->take($limit)->map(function ($chat) {
                return \App\Domain\Entity\Chat::from([
                    'id' => $chat->id,
                    'project_id' => $chat->project_id,
                    'customer_id' => $chat->customer_id,
                    'message' => $chat->message,
                    'message_type' => $chat->message_type,
                    'sender_type' => $chat->sender_type,
                    'file_path' => $chat->file_path,
                    'file_name' => $chat->file_name,
                    'file_size' => $chat->file_size,
                    'is_read' => $chat->is_read,
                    'read_at' => $chat->read_at?->toISOString(),
                    'metadata' => $chat->metadata,
                    'created_at' => $chat->created_at?->toISOString(),
                    'updated_at' => $chat->updated_at?->toISOString(),
                    'customer' => $chat->customer ? \App\Domain\Entity\Customer::from($chat->customer->toArray()) : null
                ]);
            })->toArray();
        }

        return $result;
    }
}
