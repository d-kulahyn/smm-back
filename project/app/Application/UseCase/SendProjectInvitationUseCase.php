<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ProjectInvitation;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Exception\CustomerNotFoundException;
use App\Infrastructure\API\DTO\SendProjectInvitationUseCaseDto;

class SendProjectInvitationUseCase
{
    public function __construct(
        private readonly ProjectInvitationWriteRepositoryInterface $invitationWriteRepository,
        private readonly ProjectReadRepositoryInterface $projectReadRepository,
        private readonly CustomerReadRepositoryInterface $customerReadRepository,
        private readonly ProjectMemberReadRepositoryInterface $memberReadRepository
    ) {}

    public function execute(SendProjectInvitationUseCaseDto $dto): ProjectInvitation
    {
        // Если указан userId, проверяем что пользователь существует
        if ($dto->user_id) {
            $user = $this->customerReadRepository->findById([$dto->user_id])?->first();
            if (!$user) {
                throw new CustomerNotFoundException("User with ID {$dto->user_id} not found");
            }
        }

        // Проверяем, не является ли пользователь уже участником проекта
        if ($dto->user_id && $this->memberReadRepository->findByProjectAndUser($dto->project_id, $dto->user_id)) {
            throw new \InvalidArgumentException("User is already a member of this project");
        }

        // Создаем приглашение
        $data = [
            'project_id' => $dto->project_id,
            'invited_by' => $dto->invited_by,
            'email' => $dto->email,
            'user_id' => $dto->user_id,
            'role' => $dto->role,
            'permissions' => $dto->permissions,
            'token' => bin2hex(random_bytes(32)),
            'expires_at' => now()->addDays(7),
            'status' => 'pending'
        ];

        return $this->invitationWriteRepository->create($data);
    }
}
