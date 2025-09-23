<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\CustomerAuthMeUseCase;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\CustomerWriteRepositoryInterface;
use Illuminate\Http\JsonResponse;
use App\Application\UseCase\UpdateCustomerEmailUseCase;
use App\Infrastructure\API\DTO\UpdateCustomerEmailDTO;
use App\Application\UseCase\UpdateCustomerPasswordUseCase;
use App\Application\UseCase\UpdateCustomerUseCase;
use App\Infrastructure\API\DTO\UpdateCustomerDTO;
use App\Infrastructure\API\DTO\UpdateCustomerPasswordDTO;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Profile",
 *     description="User profile management endpoints"
 * )
 */
readonly class ProfileController
{
    /**
     * @param UpdateCustomerUseCase $updateCustomerUseCase
     * @param UpdateCustomerEmailUseCase $updateCustomerEmailUseCase
     * @param UpdateCustomerPasswordUseCase $updateCustomerPasswordUseCase
     * @param CustomerReadRepositoryInterface $customerReadRepository
     * @param CustomerWriteRepositoryInterface $customerWriteRepository
     * @param CustomerAuthMeUseCase $customerAuthMeUseCase
     */
    public function __construct(
        private UpdateCustomerUseCase $updateCustomerUseCase,
        private UpdateCustomerEmailUseCase $updateCustomerEmailUseCase,
        private UpdateCustomerPasswordUseCase $updateCustomerPasswordUseCase,
        private CustomerReadRepositoryInterface $customerReadRepository,
        private CustomerWriteRepositoryInterface $customerWriteRepository,
        private CustomerAuthMeUseCase $customerAuthMeUseCase,
    ) {}

    /**
     * @OA\Put(
     *     path="/profile",
     *     tags={"Profile"},
     *     summary="Update user profile",
     *     description="Update authenticated user's profile information",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="avatar", type="string", example="https://example.com/avatar.jpg"),
     *             @OA\Property(property="bio", type="string", example="Software developer"),
     *             @OA\Property(property="location", type="string", example="New York, USA")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Profile updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     * @param UpdateCustomerDTO $updateCustomerDTO
     *
     * @return JsonResponse
     */
    public function update(UpdateCustomerDTO $updateCustomerDTO): JsonResponse
    {
        $this->updateCustomerUseCase->execute(request()->user()->id, $updateCustomerDTO);

        return response()->json($this->customerAuthMeUseCase->execute(request()->user()->id));
    }

    /**
     * @OA\Put(
     *     path="/profile/password",
     *     tags={"Profile"},
     *     summary="Update user password",
     *     description="Change authenticated user's password",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"current_password", "password", "password_confirmation"},
     *             @OA\Property(property="current_password", type="string", format="password", example="current123"),
     *             @OA\Property(property="password", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Password has been updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Current password is incorrect"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     * @param UpdateCustomerPasswordDTO $updateCustomerPasswordDTO
     *
     * @return JsonResponse
     */
    public function updatePassword(UpdateCustomerPasswordDTO $updateCustomerPasswordDTO): JsonResponse
    {
        $this->updateCustomerPasswordUseCase->execute(request()->user()->id, $updateCustomerPasswordDTO);

        return response()->json(['message' => 'Password has been updated successfully.']);
    }

    /**
     * @OA\Put(
     *     path="/profile/email",
     *     tags={"Profile"},
     *     summary="Update user email",
     *     description="Change authenticated user's email address",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="newemail@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="currentpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email has been updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Password is incorrect or email already exists"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     * @param UpdateCustomerEmailDTO $updateCustomerEmailDTO
     *
     * @return JsonResponse
     */
    public function updateEmail(UpdateCustomerEmailDTO $updateCustomerEmailDTO): JsonResponse
    {
        $this->updateCustomerEmailUseCase->execute(request()->user()->id, $updateCustomerEmailDTO);

        return response()->json(['message' => 'Email has been updated successfully.']);
    }

    /**
     * @OA\Post(
     *     path="/profile/fcm-token",
     *     tags={"Profile"},
     *     summary="Set Firebase Cloud Messaging token",
     *     description="Update user's Firebase Cloud Messaging token for push notifications",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token"},
     *             @OA\Property(
     *                 property="token",
     *                 type="string",
     *                 example="dGhpcyBpcyBhIGZha2UgRkNNIHRva2Vu",
     *                 description="Firebase Cloud Messaging token"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="FCM token updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Token has been updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     * @return JsonResponse
     */
    public function setCloudMessagingToken(): JsonResponse
    {
        request()->validate([
            'token' => 'required|string'
        ]);

        $customer = $this->customerReadRepository->findById([request()->user()->id])->first();

        $customer->firebase_cloud_messaging_token = request()->input('token');

        $this->customerWriteRepository->save($customer);

        return response()->json(['message' => 'Token has been updated successfully.']);
    }
}
