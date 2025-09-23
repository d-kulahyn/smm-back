<?php

namespace App\Domain\Policies;

use App\Domain\Entity\Customer;
use App\Domain\Enum\PermissionEnum;
use App\Models\Customer as CustomerModel;
use App\Models\MediaFile;

class MediaFilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasAnyPermission([
            PermissionEnum::VIEW_ALL_MEDIA,
            PermissionEnum::UPLOAD_MEDIA,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(CustomerModel $customer, MediaFile $mediaFile): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может видеть все файлы
        if ($customerEntity->hasPermission(PermissionEnum::VIEW_ALL_MEDIA)) {
            return true;
        }

        // Загрузивший файл может видеть его
        if ($mediaFile->uploaded_by === $customer->id) {
            return true;
        }

        // Участники проекта/задачи могут видеть связанные файлы
        if ($customerEntity->hasPermission(PermissionEnum::UPLOAD_MEDIA)) {
            // Здесь нужно проверить доступ к связанному ресурсу (проект/задача)
            return $this->hasAccessToRelatedResource($customer, $mediaFile);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(CustomerModel $customer): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::UPLOAD_MEDIA);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(CustomerModel $customer, MediaFile $mediaFile): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может обновлять все файлы
        if ($customerEntity->hasPermission(PermissionEnum::VIEW_ALL_MEDIA)) {
            return true;
        }

        // Загрузивший файл может обновлять его
        return $mediaFile->uploaded_by === $customer->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(CustomerModel $customer, MediaFile $mediaFile): bool
    {
        $customerEntity = Customer::from($customer->toArray());

        // Админ может удалять любые файлы
        if ($customerEntity->hasPermission(PermissionEnum::DELETE_ANY_MEDIA)) {
            return true;
        }

        // Загрузивший файл может удалять свой файл
        if ($mediaFile->uploaded_by === $customer->id &&
            $customerEntity->hasPermission(PermissionEnum::DELETE_OWN_MEDIA)) {
            return true;
        }

        return false;
    }

    private function hasAccessToRelatedResource(CustomerModel $customer, MediaFile $mediaFile): bool
    {
        // Проверяем доступ к связанному ресурсу
        if ($mediaFile->fileable_type === 'App\Models\Project') {
            // Проверяем доступ к проекту
            $project = \App\Models\Project::find($mediaFile->fileable_id);
            if ($project) {
                return app(\App\Domain\Policies\ProjectPolicy::class)->view($customer, $project);
            }
        }

        if ($mediaFile->fileable_type === 'App\Models\Task') {
            // Проверяем доступ к задаче
            $task = \App\Models\Task::find($mediaFile->fileable_id);
            if ($task) {
                return app(\App\Domain\Policies\TaskPolicy::class)->view($customer, $task);
            }
        }

        return false;
    }
}
