<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Mapper;

use App\Models\Customer;

class CustomerMapper
{
    public function __construct(private readonly ChatMapper $chatMapper) {}

    /**
     * @param Customer $customer
     *
     * @return \App\Domain\Entity\Customer
     */
    public function toDomain(Customer $customer): \App\Domain\Entity\Customer
    {
        return new \App\Domain\Entity\Customer(
            password                      : $customer->password,
            email                         : $customer->email,
            email_notifications           : $customer->email_notifications,
            push_notifications            : $customer->push_notifications,
            chats                         : $customer->relationLoaded('chats') ? array_map(fn($chat
            ) => $this->chatMapper->toDomain($chat), $customer->chats->all()) : [],
            firebase_cloud_messaging_token: $customer->firebase_cloud_messaging_token,
            social_type                   : $customer->social_type,
            social_id                     : $customer->social_id,
            email_verified_at             : $customer->email_verified_at?->format('Y-m-d H:i:s'),
            name                          : $customer->name,
            avatar                        : $customer->avatar,
            id                            : $customer->id
        );
    }
}
