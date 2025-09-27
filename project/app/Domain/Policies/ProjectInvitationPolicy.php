<?php

declare(strict_types=1);

namespace App\Domain\Policies;

use App\Models\Customer;
use App\Domain\Entity\Customer as CustomerEntity;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Domain\Enum\PermissionEnum;

class ProjectInvitationPolicy
{

    public function viewAny(Customer $customer): bool
    {
        $customerEntity = CustomerEntity::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECT_INVITATIONS) ||
            $customerEntity->hasPermission(PermissionEnum::VIEW_PROJECT_INVITATIONS);
    }


    public function view(Customer $customer, ProjectInvitation $invitation): bool
    {
        $customerEntity = CustomerEntity::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECT_INVITATIONS) ||
            $invitation->project->customer_id === $customerEntity->id ||
            $invitation->invited_by === $customerEntity->id ||
            $invitation->invited_user_id === $customerEntity->id ||
            $customerEntity->email === $invitation->email;
    }

    public function create(Customer $customer): bool
    {
        $customerEntity = CustomerEntity::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::SEND_PROJECT_INVITATIONS) ||
            $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECT_INVITATIONS);
    }

    public function sendToProject(Customer $customer, int $projectId): bool
    {
        $project = Project::find($projectId);

        if (!$project) {
            return false;
        }

        $customerEntity = CustomerEntity::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECT_INVITATIONS) ||
            $project->customer_id === $customerEntity->id ||
            ($project->members()->where('customer_id', $customerEntity->id)->exists() &&
                $customerEntity->hasPermission(PermissionEnum::SEND_PROJECT_INVITATIONS));
    }

    public function accept(Customer $customer, \App\Domain\Entity\ProjectInvitation $invitation): bool
    {
        $customerEntity = CustomerEntity::from($customer->toArray());

        return $invitation->invited_user_id === $customerEntity->id &&
            $invitation->status === 'pending' &&
            !$invitation->isExpired();
    }

    public function decline(Customer $customer, \App\Domain\Entity\ProjectInvitation $invitation): bool
    {
        $customerEntity = CustomerEntity::from($customer->toArray());

        return $customerEntity->hasPermission(PermissionEnum::MANAGE_ALL_PROJECT_INVITATIONS) ||
            ($invitation->invited_user_id === $customerEntity->id &&
                $invitation->status === 'pending');
    }
}
