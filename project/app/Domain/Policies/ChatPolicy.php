<?php

namespace App\Domain\Policies;

use App\Domain\Entity\Customer;
use App\Domain\Enum\PermissionEnum;
use App\Models\Customer as CustomerModel;
use App\Models\Chat;

class ChatPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([
            PermissionEnum::MANAGE_ALL_CHATS,
            PermissionEnum::VIEW_PROJECT_CHATS,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может видеть все чаты
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_CHATS)) {
            return true;
        }

        // Участник чата может видеть сообщения
        if ($chat->customer_id === $customer->id) {
            return true;
        }

        // Проверяем доступ к проекту для просмотра чатов проекта
        if ($customerEntity->hasPermission(PermissionEnum::VIEW_PROJECT_CHATS)) {
            // Здесь нужно проверить, имеет ли пользователь доступ к проекту
            // Для примера разрешаем менеджерам и админам
            return $customerEntity->isProjectManager() || $customerEntity->isAdmin();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::SEND_MESSAGES);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может редактировать все сообщения
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_CHATS)) {
            return true;
        }

        // Автор может редактировать свое сообщение
        return $chat->customer_id === $customer->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(CustomerModel $customer, Chat $chat): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может удалять любые сообщения
        if ($customerEntity->hasPermission(PermissionEnum::DELETE_MESSAGES)) {
            return true;
        }

        // Автор может удалять свое сообщение
        return $chat->customer_id === $customer->id;
    }
}
