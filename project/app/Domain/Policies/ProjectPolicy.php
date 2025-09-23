<?php

namespace App\Domain\Policies;

use App\Domain\Entity\Customer;
use App\Domain\Enum\PermissionEnum;
use App\Models\Customer as CustomerModel;
use App\Models\Project;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([
            PermissionEnum::MANAGE_ALL_PROJECTS,
            PermissionEnum::MANAGE_ASSIGNED_PROJECTS,
            PermissionEnum::VIEW_OWN_PROJECTS,
            PermissionEnum::VIEW_ASSIGNED_PROJECTS,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(CustomerModel $customer, Project $project): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может видеть все проекты
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECTS)) {
            return true;
        }

        // Владелец проекта может видеть свой проект
        if ($project->customer_id === $customer->id &&
            $customerEntity->hasPermission(PermissionEnum::VIEW_OWN_PROJECTS)) {
            return true;
        }

        // Менеджер проекта может видеть назначенные проекты
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ASSIGNED_PROJECTS)) {
            // Здесь нужно проверить, назначен ли пользователь на этот проект
            // Для примера считаем, что project_manager может видеть все проекты
            return $customerEntity->isProjectManager();
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
            PermissionEnum::MANAGE_ALL_PROJECTS,
            PermissionEnum::CREATE_PROJECTS,
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(CustomerModel $customer, Project $project): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может обновлять все проекты
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECTS)) {
            return true;
        }

        // Владелец проекта может обновлять свой проект
        if ($project->customer_id === $customer->id &&
            $customerEntity->hasPermission(PermissionEnum::VIEW_OWN_PROJECTS)) {
            return true;
        }

        // Менеджер может обновлять назначенные проекты
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ASSIGNED_PROJECTS)) {
            return $customerEntity->isProjectManager();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(CustomerModel $customer, Project $project): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Только админ или владелец может удалять проекты
        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECTS) ||
               ($project->customer_id === $customer->id &&
                $customerEntity->hasPermission(PermissionEnum::DELETE_PROJECTS));
    }

    /**
     * Determine whether the user can manage project members.
     */
    public function manageMembers(CustomerModel $customer, Project $project): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может управлять участниками всех проектов
        if ($customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECTS)) {
            return true;
        }

        // Владелец проекта может управлять участниками своего проекта
        if ($project->customer_id === $customer->id) {
            return true;
        }

        // Проверяем, является ли пользователь участником проекта с правами управления
        $member = $project->members()->where('user_id', $customer->id)->first();
        if ($member && $member->canManageMembers()) {
            return true;
        }

        return false;
    }
}
