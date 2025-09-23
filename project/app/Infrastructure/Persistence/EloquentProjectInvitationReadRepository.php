<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Infrastructure\Mapper\ProjectInvitationMapper;
use App\Models\ProjectInvitation as EloquentProjectInvitation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentProjectInvitationReadRepository implements ProjectInvitationReadRepositoryInterface
{
    public function __construct(
        private readonly ProjectInvitationMapper $mapper
    ) {}

    public function findById(int $id): ?ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])->find($id);

        return $eloquentInvitation ? $this->mapper->toDomain($eloquentInvitation) : null;
    }

    public function findByToken(string $token): ?ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('token', $token)
            ->first();

        return $eloquentInvitation ? $this->mapper->toDomain($eloquentInvitation) : null;
    }

    public function findByProjectId(int $projectId): array
    {
        $eloquentInvitations = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $eloquentInvitations->map(fn($invitation) => $this->mapper->toDomain($invitation))->toArray();
    }

    public function findByEmail(string $email): array
    {
        $eloquentInvitations = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('email', $email)
            ->orderBy('created_at', 'desc')
            ->get();

        return $eloquentInvitations->map(fn($invitation) => $this->mapper->toDomain($invitation))->toArray();
    }

    public function findByUserId(int $userId): array
    {
        $eloquentInvitations = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('invited_user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $eloquentInvitations->map(fn($invitation) => $this->mapper->toDomain($invitation))->toArray();
    }

    public function findPendingByProject(int $projectId): array
    {
        $eloquentInvitations = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('project_id', $projectId)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->get();

        return $eloquentInvitations->map(fn($invitation) => $this->mapper->toDomain($invitation))->toArray();
    }

    public function findExpiredInvitations(): array
    {
        $eloquentInvitations = EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('status', 'pending')
            ->where('expires_at', '<=', now())
            ->get();

        return $eloquentInvitations->map(fn($invitation) => $this->mapper->toDomain($invitation))->toArray();
    }

    public function findByProjectIdPaginated(int $projectId, int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByUserIdPaginated(int $userId, int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return EloquentProjectInvitation::with(['project', 'invitedBy', 'invitedUser'])
            ->where('user_id', $userId)
            ->orWhere('email', function ($query) use ($userId) {
                $query->select('email')
                    ->from('customers')
                    ->where('id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
