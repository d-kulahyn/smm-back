<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Customer;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\CustomerWriteRepositoryInterface;
use App\Infrastructure\API\DTO\UpdateCustomerPasswordDTO;

readonly class UpdateCustomerPasswordUseCase
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
     * @param UpdateCustomerPasswordDTO $updateCustomerPasswordDTO
     *
     * @return void
     */
    public function execute(int $id, UpdateCustomerPasswordDTO $updateCustomerPasswordDTO): void
    {
        /** @var Customer $customer */
        $customer = $this->customerReadRepository->findById([$id])->first();

        $customer->password = (bcrypt($updateCustomerPasswordDTO->new_password));

        $this->customerWriteRepository->save($customer);
    }
}
