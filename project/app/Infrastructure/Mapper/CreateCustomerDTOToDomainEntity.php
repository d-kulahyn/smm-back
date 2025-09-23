<?php

declare(strict_types=1);

namespace App\Infrastructure\Mapper;

use App\Domain\Entity\Customer;
use App\Infrastructure\API\DTO\CreateUserDTO;

class CreateCustomerDTOToDomainEntity
{
    /**
     * @param CreateUserDTO $createUserDTO
     *
     * @return Customer
     */
    public static function toEntity(CreateUserDTO $createUserDTO): Customer
    {
        return new Customer(
            password                      : $createUserDTO->password,
            email                         : $createUserDTO->email,
            firebase_cloud_messaging_token: $createUserDTO->firebase_cloud_messaging_token,
            name                          : $createUserDTO->name,
        );
    }
}
