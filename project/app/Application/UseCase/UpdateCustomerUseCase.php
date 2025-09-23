<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Customer;
use App\Infrastructure\API\DTO\UpdateCustomerDTO;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\CustomerWriteRepositoryInterface;
use Illuminate\Support\Facades\Cache;

readonly class UpdateCustomerUseCase
{
    /**
     * @param CustomerReadRepositoryInterface $customerReadRepository
     * @param CustomerWriteRepositoryInterface $customerWriteRepository
     */
    public function __construct(
        private CustomerReadRepositoryInterface $customerReadRepository,
        private CustomerWriteRepositoryInterface $customerWriteRepository
    ) {}

    /**
     * @param int $id
     * @param UpdateCustomerDTO $updateCustomerDTO
     *
     * @return void
     */
    public function execute(int $id, UpdateCustomerDTO $updateCustomerDTO): void
    {
        /** @var Customer $customer */
        $customer = $this->customerReadRepository->findById([$id])->first();

        $customer->name = $updateCustomerDTO->name;
        $customer->email_notifications = $updateCustomerDTO->email_notifications;
        $customer->push_notifications = $updateCustomerDTO->push_notifications;

        Cache::forget("customer:{$customer->id}:balance");

        $this->customerWriteRepository->save($customer);
    }
}
