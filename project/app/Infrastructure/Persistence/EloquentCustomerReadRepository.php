<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Customer;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Infrastructure\Persistence\Mappers\EloquentCustomerMapper;
use Illuminate\Support\Collection;

class EloquentCustomerReadRepository implements CustomerReadRepositoryInterface
{
    /**
     * @param string $field
     * @param string $login
     *
     * @return Customer|null
     */
    public function findByLogin(string $field, string $login): ?Customer
    {
        $customer = \App\Models\Customer::where($field, $login)->first();

        if (!$customer) {
            return null;
        }

        return EloquentCustomerMapper::map($customer);
    }

    /**
     * @param string $email
     *
     * @return Customer|null
     */
    public function findByEmail(string $email): ?Customer
    {
        $customer = \App\Models\Customer::where('email', $email)->first();

        if (!$customer) {
            return null;
        }

        return EloquentCustomerMapper::map($customer);
    }

    /**
     * @param array $ids
     * @param array $with
     *
     * @return Customer|null
     */
    public function findById(array $ids, array $with = []): ?Collection
    {
        $customer = \App\Models\Customer::with($with)->whereKey($ids)->get();

        if ($customer->isEmpty()) {
            return null;
        }

        return $customer->mapWithKeys(function ($customer) {
            return [$customer->id => EloquentCustomerMapper::map($customer)];
        });
    }

    /**
     * @param string $id
     * @param string $social
     *
     * @return Customer|null
     */
    public function getBySocialId(string $id, string $social): ?Customer
    {
        $customer = \App\Models\Customer::where('social_id', $id)
            ->where('social_type', $social)
            ->first();

        if (!$customer) {
            return null;
        }

        return EloquentCustomerMapper::map($customer);
    }

    /**
     * @param array $customerId
     * @param array $friendId
     *
     * @return Collection|null
     */
    public function getCustomersWithoutSpecificFriends(array $customerId, array $friendId): ?Collection
    {
        $customers = \App\Models\Customer::whereKey($customerId)
            ->whereDoesntHave('friends', function ($query) use ($friendId) {
                $query->whereKey($friendId);
            })->get();

        if ($customers->isEmpty()) {
            return null;
        }

        return $customers->map(function ($customer) {
            return EloquentCustomerMapper::map($customer);
        });
    }
}
