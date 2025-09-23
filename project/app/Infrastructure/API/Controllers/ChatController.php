<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\SendChatMessageUseCase;
use App\Domain\Event\ChatMessageReadEvent;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\SendChatMessageDto;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\SendVoiceMessageDto;
use App\Infrastructure\API\Resource\ChatResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Infrastructure\Services\FileStorageService;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Chats",
 *     description="Project chat and messaging endpoints"
 * )
 */
class ChatController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private readonly ChatReadRepositoryInterface $chatReadRepository,
        private readonly ChatWriteRepositoryInterface $chatWriteRepository,
        private readonly SendChatMessageUseCase $sendChatMessageUseCase,
        private readonly FileStorageService $fileStorageService
    ) {}

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/chats",
     *     tags={"Chats"},
     *     summary="Get project chat messages",
     *     description="Retrieve paginated list of chat messages for a specific project",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *         @OA\Schema(type="integer", example=50)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/Chat")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function index(Request $request, int $projectId, Chat $chat): AnonymousResourceCollection
    {
        $this->authorize('viewAny', $chat);

        $params = $this->getPaginationParams($request);

        return ChatResource::collection(
            $this->chatReadRepository->findByProjectIdPaginated($projectId, $params)
        );
    }

    /**
     * @OA\Post(
     *     path="/chats",
     *     tags={"Chats"},
     *     summary="Send a text message",
     *     description="Send a text message to project chat",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"project_id", "message"},
     *             @OA\Property(property="project_id", type="integer", example=1),
     *             @OA\Property(property="message", type="string", example="Hello, this is a test message"),
     *             @OA\Property(property="message_type", type="string", enum={"text", "voice", "file", "image"}, example="text"),
     *             @OA\Property(property="sender_type", type="string", enum={"customer", "admin"}, example="customer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Message sent successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Chat")
     *     )
     * )
     */
    public function store(SendChatMessageDto $dto, Request $request): JsonResponse
    {
        $this->authorize('create', Chat::class);

        $textMessageDto = TextMessageUseCaseDto::fromTextMessage(
            projectId  : $dto->project_id,
            customerId : $request->user()->id,
            message    : $dto->message,
            messageType: $dto->message_type ?? 'text'
        );

        $chat = $this->sendChatMessageUseCase->execute($textMessageDto);

        return response()->json(new ChatResource($chat), Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats/voice",
     *     tags={"Chats"},
     *     summary="Send a voice message",
     *     description="Send a voice message to project chat",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"voice_file"},
     *                 @OA\Property(
     *                     property="voice_file",
     *                     type="string",
     *                     format="binary",
     *                     description="Voice file (mp3, wav, ogg, m4a, max 5MB)"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Voice message sent successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Chat")
     *     )
     * )
     */
    public function sendVoice(SendVoiceMessageDto $dto, Request $request, int $projectId): JsonResponse
    {
        $this->authorize('create', Chat::class);

        $voiceFile = $request->file('voice_file');

        // Use FileStorageService to create voice message DTO
        $voiceMessageDto = $this->fileStorageService->createVoiceMessageDto(
            $voiceFile,
            $projectId,
            $request->user()->id
        );

        $chat = $this->sendChatMessageUseCase->execute($voiceMessageDto);

        return response()->json(new ChatResource($chat), Response::HTTP_CREATED);
    }

    /**
     * @OA\Patch(
     *     path="/chats/{chatId}/mark-as-read",
     *     tags={"Chats"},
     *     summary="Mark message as read",
     *     description="Mark a chat message as read",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="chatId",
     *         in="path",
     *         description="Chat message ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Message marked as read successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Chat")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Chat message not found"
     *     )
     * )
     */
    public function markAsRead(Chat $chat): JsonResponse
    {
        $this->authorize('update', $chat);

        $updatedChat = $this->chatWriteRepository->markAsRead($chat->id);

        // Send event through sockets
        event(new ChatMessageReadEvent($chat->project_id, $updatedChat));

        return response()->json(new ChatResource($updatedChat));
    }
}
