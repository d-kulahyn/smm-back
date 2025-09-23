<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Infrastructure\Mapper\ProjectInvitationMapper;
use App\Models\ProjectInvitation as EloquentProjectInvitation;

readonly class EloquentProjectInvitationWriteRepository implements ProjectInvitationWriteRepositoryInterface
{
    public function __construct(
        private ProjectInvitationMapper $mapper
    ) {}

    public function create(array $data): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::create($data);
        $eloquentInvitation->load(['project', 'invitedBy', 'invitedUser']);

        return $this->mapper->toDomain($eloquentInvitation);
    }

    public function update(int $id, array $data): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::findOrFail($id);
        $eloquentInvitation->update($data);
        $eloquentInvitation->load(['project', 'invitedBy', 'invitedUser']);

        return $this->mapper->toDomain($eloquentInvitation);
    }

    public function delete(int $id): bool
    {
        return EloquentProjectInvitation::destroy($id) > 0;
    }

    public function acceptInvitation(string $token, int $userId): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::where('token', $token)
            ->where('status', 'pending')
            ->firstOrFail();

        $eloquentInvitation->update([
            'status' => 'accepted',
            'accepted_at' => now(),
            'invited_user_id' => $userId
        ]);

        $eloquentInvitation->load(['project', 'invitedBy', 'invitedUser']);

        return $this->mapper->toDomain($eloquentInvitation);
    }

    public function declineInvitation(string $token): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::where('token', $token)
            ->where('status', 'pending')
            ->firstOrFail();

        $eloquentInvitation->update([
            'status' => 'declined',
            'declined_at' => now()
        ]);

        $eloquentInvitation->load(['project', 'invitedBy', 'invitedUser']);

        return $this->mapper->toDomain($eloquentInvitation);
    }

    public function markAsExpired(int $id): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::findOrFail($id);
        $eloquentInvitation->update(['status' => 'expired']);
        $eloquentInvitation->load(['project', 'invitedBy', 'invitedUser']);

        return $this->mapper->toDomain($eloquentInvitation);
    }

    public function markExpiredInvitations(): int
    {
        return EloquentProjectInvitation::where('status', 'pending')
            ->where('expires_at', '<=', now())
            ->update(['status' => 'expired']);
    }
}
