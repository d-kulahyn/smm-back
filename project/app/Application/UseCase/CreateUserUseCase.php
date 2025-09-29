<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Customer;
use App\Domain\Enum\RoleEnum;
use Illuminate\Support\Facades\DB;
use App\Infrastructure\API\DTO\CreateUserDTO;
use App\Infrastructure\Service\PasswordEncoder;
use App\Domain\Repository\CustomerWriteRepositoryInterface;

readonly class CreateUserUseCase
{
    /**
     * @param PasswordEncoder $passwordEncoder
     * @param CustomerWriteRepositoryInterface $customerWriteRepository
     * @param SendConfirmationCodeToCustomerUseCase $sendConfirmationCodeToCustomerUseCase
     */
    public function __construct(
        private PasswordEncoder $passwordEncoder,
        private CustomerWriteRepositoryInterface $customerWriteRepository,
        private SendConfirmationCodeToCustomerUseCase $sendConfirmationCodeToCustomerUseCase
    ) {}

    /**
     * @param CreateUserDTO $createUserDTO
     *
     * @return array
     */
    public function execute(CreateUserDTO $createUserDTO): array
    {
        return DB::transaction(function () use ($createUserDTO) {
            $createUserDTO->password = $this->passwordEncoder->hash($createUserDTO->password);

            $createUserDTO->name = explode('@', $createUserDTO->email)[0];

            $customerEntity = new Customer(
                password                      : $createUserDTO->password,
                email                         : $createUserDTO->email,
                role                          : RoleEnum::ADMIN->value,
                firebase_cloud_messaging_token: $createUserDTO->firebase_cloud_messaging_token,
                name                          : $createUserDTO->name
            );

            $customerId = $this->customerWriteRepository->save($customerEntity);

            $code = $this->sendConfirmationCodeToCustomerUseCase->execute($createUserDTO->email);

            return [$this->customerWriteRepository->createToken($customerId), $code];
        });
    }
}
