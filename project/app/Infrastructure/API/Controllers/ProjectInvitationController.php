<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\SendProjectInvitationUseCase;
use App\Application\UseCase\AcceptProjectInvitationUseCase;
use App\Application\UseCase\DeclineProjectInvitationUseCase;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Infrastructure\API\DTO\SendProjectInvitationDto;
use App\Infrastructure\API\DTO\SendProjectInvitationUseCaseDto;
use App\Infrastructure\API\DTO\AcceptProjectInvitationUseCaseDto;
use App\Infrastructure\API\DTO\DeclineProjectInvitationUseCaseDto;
use App\Infrastructure\API\Resource\ProjectInvitationResource;
use App\Infrastructure\API\Resource\CustomerResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Project Invitations",
 *     description="Project invitation management endpoints"
 * )
 */
class ProjectInvitationController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private readonly ProjectInvitationReadRepositoryInterface $invitationReadRepository,
        private readonly SendProjectInvitationUseCase $sendInvitationUseCase,
        private readonly AcceptProjectInvitationUseCase $acceptInvitationUseCase,
        private readonly DeclineProjectInvitationUseCase $declineInvitationUseCase
    ) {}

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/invitations",
     *     tags={"Project Invitations"},
     *     summary="Get project invitations",
     *     description="Retrieve paginated list of invitations for a specific project",
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
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/ProjectInvitation")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function index(Project $project, Request $request): AnonymousResourceCollection
    {
        $this->authorize('manageMembers', $project);

        $params = $this->getPaginationParams($request);

        return ProjectInvitationResource::collection(
            $this->invitationReadRepository->findByProjectIdPaginated($project->id, $params->page, $params->perPage)
        );
    }

    /**
     * @OA\Post(
     *     path="/projects/{projectId}/invitations",
     *     tags={"Project Invitations"},
     *     summary="Send project invitation",
     *     description="Send an invitation to join a project",
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
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="user_id", type="integer", example=2),
     *             @OA\Property(property="role", type="string", enum={"admin", "member", "viewer"}, example="member"),
     *             @OA\Property(property="permissions", type="array", @OA\Items(type="string"), example={"read", "write"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Invitation sent successfully",
     *         @OA\JsonContent(ref="#/components/schemas/ProjectInvitation")
     *     )
     * )
     */
    public function store(SendProjectInvitationDto $dto, Project $project, Request $request): JsonResponse
    {
        $this->authorize('manageMembers', $project);

        $invitationDto = SendProjectInvitationUseCaseDto::fromSendProjectInvitationDto(
            $dto,
            $project->id,
            $request->user()->id
        );

        $invitation = $this->sendInvitationUseCase->execute($invitationDto);

        return response()->json(new ProjectInvitationResource($invitation), Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/invitations/{token}/accept",
     *     tags={"Project Invitations"},
     *     summary="Accept project invitation",
     *     description="Accept a project invitation using the invitation token",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="token",
     *         in="path",
     *         description="Invitation token",
     *         required=true,
     *         @OA\Schema(type="string", example="abc123def456")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Invitation accepted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invitation accepted successfully"),
     *             @OA\Property(property="member", ref="#/components/schemas/ProjectMember")
     *         )
     *     )
     * )
     */
    public function accept(string $token, Request $request): JsonResponse
    {
        $acceptDto = AcceptProjectInvitationUseCaseDto::fromTokenAndUserId($token, $request->user()->id);

        $customer = $this->acceptInvitationUseCase->execute($acceptDto);

        return response()->json([
            'message' => 'Invitation accepted successfully',
            'customer' => new CustomerResource($customer)
        ]);
    }

    /**
     * @OA\Post(
     *     path="/invitations/{token}/decline",
     *     tags={"Project Invitations"},
     *     summary="Decline project invitation",
     *     description="Decline a project invitation using the invitation token",
     *     @OA\Parameter(
     *         name="token",
     *         in="path",
     *         description="Invitation token",
     *         required=true,
     *         @OA\Schema(type="string", example="abc123def456")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Invitation declined successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invitation declined successfully"),
     *             @OA\Property(property="invitation", ref="#/components/schemas/ProjectInvitation")
     *         )
     *     )
     * )
     */
    public function decline(string $token): JsonResponse
    {
        $declineDto = DeclineProjectInvitationUseCaseDto::fromToken($token);

        $invitation = $this->declineInvitationUseCase->execute($declineDto);

        return response()->json([
            'message' => 'Invitation declined successfully',
            'invitation' => new ProjectInvitationResource($invitation)
        ]);
    }

    /**
     * @OA\Get(
     *     path="/my-invitations",
     *     tags={"Project Invitations"},
     *     summary="Get my invitations",
     *     description="Retrieve paginated list of invitations for the authenticated user",
     *     security={{"sanctum": {}}},
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
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/ProjectInvitation")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function myInvitations(Request $request): AnonymousResourceCollection
    {
        $params = $this->getPaginationParams($request);

        return ProjectInvitationResource::collection(
            $this->invitationReadRepository->findByUserIdPaginated($request->user()->id, $params->page, $params->perPage)
        );
    }
}
