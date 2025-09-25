<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\CreateChatUseCase;
use App\Application\UseCase\SendChatMessageUseCase;
use App\Application\UseCase\UpdateChatUseCase;
use App\Application\UseCase\DeleteChatUseCase;
use App\Application\UseCase\MarkMessageAsReadUseCase;
use App\Application\UseCase\MarkAllMessagesAsReadUseCase;
use App\Domain\Exception\ProjectNotFoundException;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateChatData;
use App\Infrastructure\API\DTO\SendMessageData;
use App\Infrastructure\API\DTO\SendVoiceMessageData;
use App\Infrastructure\API\DTO\CreateChatDto;
use App\Infrastructure\API\DTO\TextMessageUseCaseDto;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use App\Infrastructure\API\Resource\ChatResource;
use App\Infrastructure\API\Resource\ChatMessageResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Infrastructure\Services\FileStorageService;
use App\Models\Chat;
use App\Models\Project;
use Illuminate\Auth\Access\AuthorizationException;
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
        private readonly CreateChatUseCase $createChatUseCase,
        private readonly UpdateChatUseCase $updateChatUseCase,
        private readonly DeleteChatUseCase $deleteChatUseCase,
        private readonly MarkMessageAsReadUseCase $markMessageAsReadUseCase,
        private readonly MarkAllMessagesAsReadUseCase $markAllMessagesAsReadUseCase,
        private readonly FileStorageService $fileStorageService
    ) {}

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/chats",
     *     tags={"Chats"},
     *     summary="Get project chats",
     *     description="Retrieve paginated list of chats for a specific project",
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
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/Chat")
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request, int $projectId): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Chat::class);

        $params = $this->getPaginationParams($request);

        return ChatResource::collection(
            $this->chatReadRepository->findChatsByProjectIdPaginated($projectId, $params)
        );
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats",
     *     tags={"Chats"},
     *     summary="Create a new chat",
     *     description="Create a new chat for a specific project",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="Project Discussion"),
     *             @OA\Property(property="description", type="string", nullable=true, example="Chat for discussing project details"),
     *             @OA\Property(property="status", type="string", enum={"active", "inactive", "archived"}, example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Chat created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Chat")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Access denied to project"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found"
     *     )
     * )
     * @throws AuthorizationException|ProjectNotFoundException
     */
    public function create(CreateChatData $data, Project $project): ChatResource
    {
        $this->authorize('create', Chat::class);

        // Create DTO with validated data
        $createChatDto = new CreateChatDto(
            project_id : $project->id,
            customer_id: request()->user()->id,
            title      : $data->title,
            description: $data->description,
            status     : $data->status,
        );

        $chat = $this->createChatUseCase->execute($createChatDto);

        return new ChatResource($chat);
    }

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/chats/{chatId}",
     *     tags={"Chats"},
     *     summary="Get specific chat",
     *     description="Retrieve details of a specific chat",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Chat details",
     *         @OA\JsonContent(ref="#/components/schemas/Chat")
     *     )
     * )
     */
    public function show(Project $project, Chat $chat): ChatResource
    {
        $this->authorize('view', $chat);

        return new ChatResource($this->chatReadRepository->findChatById($chat->id));
    }

    /**
     * @OA\Put(
     *     path="/projects/{projectId}/chats/{chatId}",
     *     tags={"Chats"},
     *     summary="Update chat",
     *     description="Update chat details",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Chat updated successfully"
     *     )
     * )
     */
    public function update(CreateChatData $data, Project $project, Chat $chat): ChatResource
    {
        $this->authorize('update', $chat);

        $updateChatDto = new CreateChatDto(
            project_id : $project->id,
            customer_id: request()->user()->id,
            title      : $data->title,
            description: $data->description,
            status     : $data->status,
        );

        $updatedChat = $this->updateChatUseCase->execute($chat->id, $updateChatDto);

        return new ChatResource($updatedChat);
    }

    /**
     * @OA\Delete(
     *     path="/projects/{projectId}/chats/{chatId}",
     *     tags={"Chats"},
     *     summary="Delete chat",
     *     description="Delete a chat and all its messages",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=204,
     *         description="Chat deleted successfully"
     *     )
     * )
     */
    public function destroy(Project $project, Chat $chat): JsonResponse
    {
        $this->authorize('delete', $chat);

        $this->deleteChatUseCase->execute($chat->id);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/chats/{chatId}/messages",
     *     tags={"Chats"},
     *     summary="Get chat messages",
     *     description="Retrieve paginated list of messages for a specific chat",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Chat messages"
     *     )
     * )
     */
    public function getMessages(Request $request, Project $project, Chat $chat): AnonymousResourceCollection
    {
        $this->authorize('view', $chat);

        $params = $this->getPaginationParams($request);

        return ChatMessageResource::collection(
            $this->chatReadRepository->findMessagesByChatIdPaginated($chat->id, $params)
        );
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats/{chatId}/messages",
     *     tags={"Chats"},
     *     summary="Send message to chat",
     *     description="Send a text message to specific chat",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=201,
     *         description="Message sent successfully"
     *     )
     * )
     */
    public function sendMessage(SendMessageData $data, Project $project, Chat $chat): JsonResponse
    {
        $this->authorize('create', Chat::class);

        $textMessageDto = TextMessageUseCaseDto::fromTextMessage(
            projectId  : $project->id,
            customerId : request()->user()->id,
            chatId     : $chat->id,
            message    : $data->message,
            messageType: $data->message_type ?? 'text'
        );

        $message = $this->sendChatMessageUseCase->execute($textMessageDto);

        return response()->json(new ChatMessageResource($message), Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats/{chatId}/messages/voice",
     *     tags={"Chats"},
     *     summary="Send voice message to chat",
     *     description="Send a voice message to specific chat",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=201,
     *         description="Voice message sent successfully"
     *     )
     * )
     * @throws AuthorizationException
     */
    public function sendVoiceMessage(
        SendVoiceMessageData $data,
        Request $request,
        Project $project,
        Chat $chat
    ): JsonResponse {
        $this->authorize('create', Chat::class);

        $file = $request->file('voice_file');

        $filePath = $this->fileStorageService->storeVoiceMessage($file);

        $voiceMessageDto = new VoiceMessageUseCaseDto(
            project_id  : $project->id,
            customer_id : $request->user()->id,
            chat_id     : $chat->id,
            message_type: 'voice',
            sender_type : 'customer',
            file_path   : $filePath,
            file_name   : $file->getClientOriginalName(),
            file_size   : $file->getSize()
        );

        $message = $this->sendChatMessageUseCase->execute($voiceMessageDto);

        return response()->json(new ChatMessageResource($message), Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats/{chatId}/messages/mark-all-read",
     *     tags={"Chats"},
     *     summary="Mark all messages as read",
     *     description="Mark all messages in chat as read for current user",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Messages marked as read"
     *     )
     * )
     * @throws AuthorizationException
     */
    public function markAllMessagesAsRead(Project $project, Chat $chat): JsonResponse
    {
        $this->authorize('update', $chat);

        $count = $this->markAllMessagesAsReadUseCase->execute($project->id, request()->user()->id);

        return response()->json(['message' => "Marked {$count} messages as read"]);
    }


    /**
     * @OA\Post(
     *     path="/projects/{projectId}/chats/{chatId}/messages/{messageId}/mark-read",
     *     tags={"Chats"},
     *     summary="Mark specific message as read",
     *     description="Mark a specific message as read",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Message marked as read"
     *     )
     * )
     */
    public function markMessageAsRead(Project $project, Chat $chat, int $messageId): JsonResponse
    {
        $this->authorize('update', $chat);

        $this->markMessageAsReadUseCase->execute($messageId, request()->user()->id());

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
