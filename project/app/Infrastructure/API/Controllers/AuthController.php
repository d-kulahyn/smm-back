<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\ConfirmEmailUseCase;
use App\Application\UseCase\CreateUserUseCase;
use App\Application\UseCase\CustomerAuthMeUseCase;
use App\Application\UseCase\LoginUserUseCase;
use App\Application\UseCase\LogoutUserUseCase;
use App\Application\UseCase\ResetPasswordUseCase;
use App\Application\UseCase\SendConfirmationCodeToCustomerUseCase;
use App\Application\UseCase\SocialAuthUseCase;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Infrastructure\API\DTO\ConfirmEmailDTO;
use App\Infrastructure\API\DTO\CreateUserDTO;
use App\Infrastructure\API\DTO\LoginDTO;
use App\Infrastructure\API\DTO\ResetPasswordDTO;
use App\Infrastructure\API\DTO\SocialAuthDTO;
use App\Infrastructure\API\Resource\CustomerResource;
use Illuminate\Auth\AuthenticationException;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Http\JsonResponse;
use Random\RandomException;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication and account management endpoints"
 * )
 */
readonly class AuthController
{
    /**
     * @param CreateUserUseCase $createUserUseCase
     * @param LoginUserUseCase $loginUserUseCase
     * @param LogoutUserUseCase $logoutUserUseCase
     * @param ResetPasswordUseCase $resetPasswordUseCase
     * @param ConfirmEmailUseCase $confirmEmailUseCase
     * @param SocialAuthUseCase $socialAuthUseCase
     * @param CustomerAuthMeUseCase $customerAuthMeUseCase
     * @param SendConfirmationCodeToCustomerUseCase $sendConfirmationCodeToCustomerUseCase
     * @param CustomerReadRepositoryInterface $customerReadRepository
     */
    public function __construct(
        protected CreateUserUseCase $createUserUseCase,
        protected LoginUserUseCase $loginUserUseCase,
        protected LogoutUserUseCase $logoutUserUseCase,
        protected ResetPasswordUseCase $resetPasswordUseCase,
        protected ConfirmEmailUseCase $confirmEmailUseCase,
        protected SocialAuthUseCase $socialAuthUseCase,
        protected CustomerAuthMeUseCase $customerAuthMeUseCase,
        protected SendConfirmationCodeToCustomerUseCase $sendConfirmationCodeToCustomerUseCase,
        protected CustomerReadRepositoryInterface $customerReadRepository,
    ) {}

    /**
     * @OA\Post(
     *     path="/auth/register",
     *     tags={"Authentication"},
     *     summary="Register a new user",
     *     description="Create a new user account",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="name", type="string", nullable=true, example="John Doe"),
     *             @OA\Property(property="firebase_cloud_messaging_token", type="string", nullable=true, example="dGhpcyBpcyBhIGZha2UgRkNNIHRva2Vu")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string", example="1|abc123..."),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     */
    public function register(CreateUserDTO $createUserDTO): JsonResponse
    {
        [$token, $code] = $this->createUserUseCase->execute($createUserDTO);

        $customer = $this->customerReadRepository->findByEmail($createUserDTO->email);

        return response()->json([
            'access_token' => $token,
            'code'         => $code,
            'user'         => $this->customerAuthMeUseCase->execute($customer->id),
        ], ResponseAlias::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     tags={"Authentication"},
     *     summary="Login user",
     *     description="Authenticate user and return access token",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string", example="1|abc123..."),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad login or password"
     *     )
     * )
     * @throws AuthenticationException
     */
    public function login(LoginDTO $loginDTO): JsonResponse
    {
        $token = $this->loginUserUseCase->execute($loginDTO);

        if (is_null($token)) {
            throw new AuthenticationException('Bad login or password');
        }

        return response()->json([
            'access_token' => $token,
            'user'         => $this->customerAuthMeUseCase->execute(request()->user()->id),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/auth/email/verification-code",
     *     tags={"Authentication"},
     *     summary="Send email verification code",
     *     description="Send verification code to user's email",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Verification code sent",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Confirmation code has been sent")
     *         )
     *     )
     * )
     */
    public function sendConfirmationCode(): JsonResponse
    {
        $this->sendConfirmationCodeToCustomerUseCase->execute(request()->user()->email);

        return response()->json(['message' => 'Confirmation code has been sent']);
    }

    /**
     * @OA\Post(
     *     path="/auth/logout",
     *     tags={"Authentication"},
     *     summary="Logout user",
     *     description="Revoke user's access token",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Token has been deleted successfully")
     *         )
     *     )
     * )
     */
    public function logout(): JsonResponse
    {
        $this->logoutUserUseCase->execute(request()->user()->id);

        return response()->json(['message' => 'Token has been deleted successfully']);
    }

    /**
     * @OA\Post(
     *     path="/auth/reset-password",
     *     tags={"Authentication"},
     *     summary="Reset password",
     *     description="Send password reset email to user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reset email sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email has been sent")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     * @param ResetPasswordDTO $resetPasswordDTO
     *
     * @throws RandomException
     * @return JsonResponse
     */
    public function resetPassword(ResetPasswordDTO $resetPasswordDTO): JsonResponse
    {
        $this->resetPasswordUseCase->execute($resetPasswordDTO->email);

        return response()->json(['message' => 'Email has been sent']);
    }

    /**
     * @OA\Post(
     *     path="/auth/email/confirm",
     *     tags={"Authentication"},
     *     summary="Confirm email",
     *     description="Confirm user's email address with verification code",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"code"},
     *             @OA\Property(property="code", type="string", example="123456", description="6-digit verification code")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email verified successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email has been verified")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid verification code"
     *     )
     * )
     * @param ConfirmEmailDTO $confirmEmailDTO
     *
     * @return JsonResponse
     */
    public function confirmEmail(ConfirmEmailDTO $confirmEmailDTO): JsonResponse
    {
        $this->confirmEmailUseCase->execute(request()->user()->id);

        return response()->json(['message' => 'Email has been verified']);
    }

    /**
     * @OA\Post(
     *     path="/auth/social/{provider}",
     *     tags={"Authentication"},
     *     summary="Social authentication",
     *     description="Authenticate user via social provider (Google, Facebook, etc.)",
     *     @OA\Parameter(
     *         name="provider",
     *         in="path",
     *         description="Social provider name",
     *         required=true,
     *         @OA\Schema(type="string", enum={"google", "facebook", "apple"}, example="google")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"access_token"},
     *             @OA\Property(property="access_token", type="string", example="eyJhbGciOiJSUzI1NiIs...", description="Social provider access token")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Social authentication successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string", example="1|abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid social token"
     *     )
     * )
     * @param SocialAuthDTO $socialAuthDTO
     * @param string $social
     *
     * @throws RandomException
     * @return JsonResponse
     */
    public function social(SocialAuthDTO $socialAuthDTO, string $social): JsonResponse
    {
        $token = $this->socialAuthUseCase->execute($socialAuthDTO, $social);

        return response()->json(['access_token' => $token]);
    }

    /**
     * @OA\Get(
     *     path="/auth/user/me",
     *     tags={"Authentication"},
     *     summary="Get current user",
     *     description="Get authenticated user information",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="User information",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function me(): CustomerResource
    {
        return new CustomerResource($this->customerReadRepository->findById(request()->user()->id));
    }
}
