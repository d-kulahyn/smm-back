<?php

namespace App\Domain\Policies;

use App\Domain\Entity\Customer;
use App\Domain\Enum\PermissionEnum;
use App\Domain\Repository\ChatMemberReadRepositoryInterface;
use App\Models\Customer as CustomerModel;
use App\Models\Chat;

class ChatPolicy
{
    public function __construct(
        private readonly ChatMemberReadRepositoryInterface $chatMemberReadRepository,
    ) {}

    public function viewAny(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([
            PermissionEnum::MANAGE_ALL_CHATS,
            PermissionEnum::VIEW_PROJECT_CHATS,
        ]);
    }

    public function view(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_CHATS)) {
            return true;
        }

        if ($chat->customer_id === $customer->id) {
            return true;
        }

        if ($customerEntity->hasPermission(PermissionEnum::VIEW_PROJECT_CHATS) && $this->chatMemberReadRepository->isUserInChat($chat->id,
                $customerEntity->id)) {
            return true;
        }

        return false;
    }

    public function create(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([PermissionEnum::MANAGE_ALL_CHATS, PermissionEnum::CREATE_CHATS]);
    }

    public function update(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        if ($customerEntity->hasAnyPermission([PermissionEnum::MANAGE_ALL_CHATS, PermissionEnum::UPDATE_CHATS])) {
            return true;
        }

        return $chat->customer_id === $customer->id;
    }

    public function delete(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        if ($customerEntity->hasAnyPermission([PermissionEnum::MANAGE_ALL_CHATS, PermissionEnum::DELETE_MESSAGES])) {
            return true;
        }

        return $chat->customer_id === $customer->id;
    }
}
