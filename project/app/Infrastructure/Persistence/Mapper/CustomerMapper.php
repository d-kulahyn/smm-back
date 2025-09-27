<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;


use App\Models\Customer;

class CustomerMapper
{
    /**
     * @param Customer $customerEloquent
     *
     * @return \App\Domain\Entity\Customer
     */
    public static function toEntity(Customer $customerEloquent): \App\Domain\Entity\Customer
    {
        return new \App\Domain\Entity\Customer(
            $customerEloquent->password,
            $customerEloquent->email,
            $customerEloquent->email_notifications,
            $customerEloquent->push_notifications,
            $customerEloquent->firebase_cloud_messaging_token,
            $customerEloquent->social_type,
            $customerEloquent->social_id,
            $customerEloquent->email_verified_at?->format('Y-m-d H:i:s'),
            $customerEloquent->name,
            $customerEloquent->avatar,
            $customerEloquent->id,
        );
    }
}
