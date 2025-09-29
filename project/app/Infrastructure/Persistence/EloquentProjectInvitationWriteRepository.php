<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Enum\InvitationStatusEnum;
use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateProjectInvitationDto;
use App\Infrastructure\Persistence\Mapper\ProjectInvitationMapper;
use App\Models\ProjectInvitation as EloquentProjectInvitation;

readonly class EloquentProjectInvitationWriteRepository implements ProjectInvitationWriteRepositoryInterface
{
    public function __construct(
        private ProjectInvitationMapper $mapper
    ) {}

    public function create(CreateProjectInvitationDto $dto): ProjectInvitation
    {
        $eloquentInvitation = EloquentProjectInvitation::create($dto->toArray());
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

    public function accept(int $id, int $userId): ProjectInvitation
    {
        $model = EloquentProjectInvitation::findOrFail($id);

        $model->update([
            'invited_user_id' => $userId,
            'status'          => InvitationStatusEnum::ACCEPTED->value,
            'accepted_at'     => now(),
        ]);

        return $this->mapper->toDomain($model->fresh());
    }

    public function decline(int $id): ProjectInvitation
    {
        $model = EloquentProjectInvitation::findOrFail($id);

        $model->update([
            'status'      => InvitationStatusEnum::DECLINED->value,
            'declined_at' => now(),
        ]);

        return $this->mapper->toDomain($model->fresh());
    }

    public function markAsExpired(int $id): bool
    {
        $eloquentInvitation = EloquentProjectInvitation::find($id);

        if (!$eloquentInvitation) {
            return false;
        }

        $eloquentInvitation->update(['status' => InvitationStatusEnum::EXPIRED->value]);

        return true;
    }

    public function markExpiredInvitations(): int
    {
        return EloquentProjectInvitation::where('expires_at', '<', now())
            ->where('status', InvitationStatusEnum::PENDING->value)
            ->update(['status' => InvitationStatusEnum::EXPIRED->value]);
    }
}
