<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\AddProjectMemberUseCase;
use App\Application\UseCase\RemoveProjectMemberUseCase;
use App\Application\UseCase\UpdateProjectMemberUseCase;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Infrastructure\API\DTO\AddProjectMemberDto;
use App\Infrastructure\API\DTO\UpdateProjectMemberDto;
use App\Infrastructure\API\Resource\ProjectMemberResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Project Members",
 *     description="Project member management endpoints"
 * )
 */
class ProjectMemberController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private readonly ProjectMemberReadRepositoryInterface $projectMemberReadRepository,
        private readonly AddProjectMemberUseCase $addProjectMemberUseCase,
        private readonly UpdateProjectMemberUseCase $updateProjectMemberUseCase,
        private readonly RemoveProjectMemberUseCase $removeProjectMemberUseCase
    ) {}

    /**
     * @OA\Get(
     *     path="/projects/{project}/members",
     *     tags={"Project Members"},
     *     summary="Get list of project members",
     *     description="Retrieve paginated list of project members with their roles and permissions",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="project",
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
     *     @OA\Parameter(
     *         name="role",
     *         in="query",
     *         description="Filter by member role",
     *         required=false,
     *         @OA\Schema(type="string", enum={"owner", "manager", "member", "viewer"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search by member name or email",
     *         required=false,
     *         @OA\Schema(type="string", example="john")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/ProjectMember")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - User doesn't have permission to view project members",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project not found.")
     *         )
     *     )
     * )
     */
    public function index(Request $request, Project $project): AnonymousResourceCollection
    {
        $this->authorize('view', $project);

        $params = $this->getPaginationParams($request);

        $members = $this->projectMemberReadRepository->findByProjectIdPaginated(
            $project->id,
            $params->page,
            $params->perPage,
        );

        return ProjectMemberResource::collection($members);
    }

    /**
     * @OA\Post(
     *     path="/projects/{project}/members",
     *     tags={"Project Members"},
     *     summary="Add a new member to project",
     *     description="Add a new member to the project with specified role and permissions",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="project",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "role"},
     *             @OA\Property(property="user_id", type="integer", example=5, description="ID of the user to add"),
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *                 enum={"owner", "manager", "member", "viewer"},
     *                 example="member",
     *                 description="Role to assign to the member"
     *             ),
     *             @OA\Property(
     *                 property="permissions",
     *                 type="array",
     *                 @OA\Items(type="string"),
     *                 example={"view_tasks", "create_tasks", "edit_tasks"},
     *                 description="Additional permissions for the member"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Member added successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/ProjectMember"),
     *             @OA\Property(property="message", type="string", example="Member added successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request - Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - User doesn't have permission to manage project members",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project not found.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Conflict - User is already a member of the project",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User is already a member of this project.")
     *         )
     *     )
     * )
     */
    public function store(AddProjectMemberDto $dto, Project $project): JsonResponse
    {
        $this->authorize('manageMembers', $project);

        $member = $this->addProjectMemberUseCase->execute(
            $project->id,
            $dto->user_id,
            $dto->role,
            $dto->permissions
        );

        return response()->json([
            'data' => new ProjectMemberResource($member),
            'message' => 'Member added successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * @OA\Get(
     *     path="/projects/{project}/members/{userId}",
     *     tags={"Project Members"},
     *     summary="Get specific project member",
     *     description="Retrieve detailed information about a specific project member",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="project",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/ProjectMember")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project member not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project member not found.")
     *         )
     *     )
     * )
     */
    public function show(Project $project, ProjectMember $projectMember): ProjectMemberResource
    {
        $this->authorize('view', $project);

        return new ProjectMemberResource($projectMember);
    }

    /**
     * @OA\Put(
     *     path="/projects/{project}/members/{userId}",
     *     tags={"Project Members"},
     *     summary="Update project member",
     *     description="Update member's role and permissions in the project",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="project",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *                 enum={"owner", "manager", "member", "viewer"},
     *                 example="manager",
     *                 description="New role for the member"
     *             ),
     *             @OA\Property(
     *                 property="permissions",
     *                 type="array",
     *                 @OA\Items(type="string"),
     *                 example={"view_tasks", "create_tasks", "edit_tasks", "manage_members"},
     *                 description="Updated permissions for the member"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Member updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/ProjectMember"),
     *             @OA\Property(property="message", type="string", example="Member updated successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request - Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - User doesn't have permission to manage project members",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project member not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project member not found.")
     *         )
     *     )
     * )
     */
    public function update(UpdateProjectMemberDto $dto, Project $project, int $userId): ProjectMemberResource
    {
        $this->authorize('manageMembers', $project);

        $member = $this->updateProjectMemberUseCase->execute(
            $project->id,
            $userId,
            $dto->role,
            $dto->permissions
        );

        return new ProjectMemberResource($member);
    }

    /**
     * @OA\Delete(
     *     path="/projects/{project}/members/{userId}",
     *     tags={"Project Members"},
     *     summary="Remove member from project",
     *     description="Remove a member from the project",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="project",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Member removed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Member removed successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - User doesn't have permission to manage project members",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project member not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project member not found.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Conflict - Cannot remove project owner",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cannot remove project owner.")
     *         )
     *     )
     * )
     */
    public function destroy(Project $project, int $userId): JsonResponse
    {
        $this->authorize('manageMembers', $project);

        $this->removeProjectMemberUseCase->execute($project->id, $userId);

        return response()->json(['message' => 'Member removed successfully'], Response::HTTP_NO_CONTENT);
    }
}
