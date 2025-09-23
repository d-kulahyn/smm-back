<?php

namespace App\Infrastructure\API\Controllers;

/**
 * @OA\Tag(
 *     name="Social Media Accounts",
 *     description="Social media account management endpoints"
 * )
 */
use App\Application\UseCase\ConnectSocialMediaAccountUseCase;
use App\Application\UseCase\DisconnectSocialMediaAccountUseCase;
use App\Application\UseCase\RefreshSocialMediaTokenUseCase;
use App\Domain\Dto\ConnectSocialMediaAccountDto;
use App\Domain\Repository\SocialMediaAccountReadRepositoryInterface;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;
use App\Infrastructure\API\Resource\SocialMediaAccountResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SocialMediaAccountController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private SocialMediaAccountReadRepositoryInterface $socialMediaAccountReadRepository,
        private SocialMediaAccountWriteRepositoryInterface $socialMediaAccountWriteRepository,
        private ConnectSocialMediaAccountUseCase $connectSocialMediaAccountUseCase,
        private DisconnectSocialMediaAccountUseCase $disconnectSocialMediaAccountUseCase,
        private RefreshSocialMediaTokenUseCase $refreshSocialMediaTokenUseCase
    ) {}

    public function index(Request $request): JsonResponse
    {
        $projectId = $request->get('project_id');

        if ($projectId) {
            $accounts = $this->socialMediaAccountReadRepository->findByProjectId($projectId);
        } else {
            // Возвращаем пустую коллекцию, если не указан проект
            $accounts = collect();
        }

        return response()->json([
            'success' => true,
            'data' => SocialMediaAccountResource::collection($accounts)
        ]);
    }

    public function store(ConnectSocialMediaAccountDto $dto): JsonResponse
    {
        $account = $this->connectSocialMediaAccountUseCase->execute($dto->toArray());

        return response()->json([
            'success' => true,
            'data' => new SocialMediaAccountResource($account),
            'message' => 'Аккаунт социальной сети успешно подключен'
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $account = $this->socialMediaAccountReadRepository->findById($id);

        if (!$account) {
            throw new \Exception('Social media account not found');
        }

        return response()->json([
            'success' => true,
            'data' => new SocialMediaAccountResource($account)
        ]);
    }

    public function refreshToken(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'access_token' => 'required|string',
            'refresh_token' => 'nullable|string',
        ]);

        $account = $this->refreshSocialMediaTokenUseCase->execute(
            $id,
            $request->access_token,
            $request->refresh_token
        );

        return response()->json([
            'success' => true,
            'data' => new SocialMediaAccountResource($account),
            'message' => 'Токен доступа обновлен'
        ]);
    }

    public function disconnect(int $id): JsonResponse
    {
        $account = $this->disconnectSocialMediaAccountUseCase->execute($id);

        return response()->json([
            'success' => true,
            'data' => new SocialMediaAccountResource($account),
            'message' => 'Аккаунт отключен'
        ]);
    }

    public function connectedPlatforms(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $platforms = $this->socialMediaAccountReadRepository->getConnectedPlatforms($request->project_id);

        return response()->json([
            'success' => true,
            'data' => ['connected_platforms' => $platforms]
        ]);
    }

    public function oauthCallback(Request $request, string $platform): JsonResponse
    {
        // Здесь будет логика обработки OAuth callback от различных платформ
        $request->validate([
            'code' => 'required|string',
            'state' => 'required|string', // Содержит project_id
        ]);

        // Парсим state для получения project_id
        $state = json_decode(base64_decode($request->state), true);
        $projectId = $state['project_id'] ?? null;

        if (!$projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный параметр state'
            ], 400);
        }

        // Здесь будет логика получения токенов от соответствующей платформы
        // Для примера возвращаем успешный ответ
        return response()->json([
            'success' => true,
            'message' => "Аккаунт {$platform} успешно подключен",
            'data' => [
                'platform' => $platform,
                'project_id' => $projectId,
                'next_step' => 'Account connection in progress'
            ]
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->socialMediaAccountWriteRepository->delete($id);

        if (!$deleted) {
            throw new \Exception('Social media account not found');
        }

        return response()->json([
            'success' => true,
            'message' => 'Подключение к социальной сети удалено'
        ]);
    }
}
