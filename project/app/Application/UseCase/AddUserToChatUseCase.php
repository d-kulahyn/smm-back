<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\ChatMember;
use App\Domain\Exception\BadRequestDomainException;
use App\Domain\Exception\CustomerNotFoundException;
use App\Domain\Repository\ChatMemberWriteRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;

readonly class AddUserToChatUseCase
{
    public function __construct(
        private ChatMemberWriteRepositoryInterface $chatMemberWriteRepository,
        private CustomerReadRepositoryInterface $customerReadRepository,
    ) {}

    /**
     * @throws BadRequestDomainException
     * @throws CustomerNotFoundException
     */
    public function execute(int $chatId, int $userId): ChatMember
    {
        $user = $this->customerReadRepository->findById([$userId])?->first();
        if (!$user) {
            throw new CustomerNotFoundException();
        }

        if ($this->chatMemberWriteRepository->isUserInChat($chatId, $userId)) {
            throw new BadRequestDomainException("User is already a member of this chat");
        }

        $memberData = [
            'chat_id'   => $chatId,
            'user_id'   => $userId,
            'joined_at' => now(),
        ];

        return $this->chatMemberWriteRepository->create($memberData);
    }
}
