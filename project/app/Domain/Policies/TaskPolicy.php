<?php

namespace App\Domain\Policies;

use App\Domain\Entity\Customer;
use App\Domain\Enum\PermissionEnum;
use App\Models\Customer as CustomerModel;
use App\Models\Task;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([
            PermissionEnum::MANAGE_ALL_TASKS,
            PermissionEnum::MANAGE_PROJECT_TASKS,
            PermissionEnum::VIEW_ASSIGNED_TASKS,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(CustomerModel $customer, Task $task): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может видеть все задачи
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_TASKS)) {
            return true;
        }

        // Создатель задачи может видеть свою задачу
        if ($task->customer_id === $customer->id) {
            return true;
        }

        // Исполнитель может видеть назначенную ему задачу
        if ($task->assigned_to === $customer->id &&
            $customerEntity->hasPermission(PermissionEnum::VIEW_ASSIGNED_TASKS)) {
            return true;
        }

        // Менеджер проекта может видеть задачи своих проектов
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_PROJECT_TASKS)) {
            // Проверяем доступ к проекту
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

        return $customerEntity->hasAnyPermission([
            PermissionEnum::MANAGE_ALL_TASKS,
            PermissionEnum::MANAGE_PROJECT_TASKS,
            PermissionEnum::CREATE_TASKS,
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(CustomerModel $customer, Task $task): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может обновлять все задачи
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_TASKS)) {
            return true;
        }

        // Создатель задачи может обновлять свою задачу
        if ($task->customer_id === $customer->id) {
            return true;
        }

        // Исполнитель может обновлять статус назначенной ему задачи
        if ($task->assigned_to === $customer->id &&
            $customerEntity->hasPermission(PermissionEnum::UPDATE_TASK_STATUS)) {
            return true;
        }

        // Менеджер может обновлять задачи проекта
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_PROJECT_TASKS)) {
            return $customerEntity->isProjectManager() || $customerEntity->isAdmin();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(CustomerModel $customer, Task $task): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Только админ или создатель может удалять задачи
        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_TASKS) ||
               ($task->customer_id === $customer->id &&
                $customerEntity->hasPermission(PermissionEnum::DELETE_TASKS));
    }
}
