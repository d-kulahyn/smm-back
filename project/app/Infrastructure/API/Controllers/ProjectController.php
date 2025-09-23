<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\CreateProjectUseCase;
use App\Application\UseCase\UpdateProjectUseCase;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\ProjectWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateProjectDto;
use App\Infrastructure\API\Resource\ProjectResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Projects",
 *     description="Project management endpoints"
 * )
 */
class ProjectController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private readonly ProjectReadRepositoryInterface $projectReadRepository,
        private readonly ProjectWriteRepositoryInterface $projectWriteRepository,
        private readonly CreateProjectUseCase $createProjectUseCase,
        private readonly UpdateProjectUseCase $updateProjectUseCase
    ) {}

    /**
     * @OA\Get(
     *     path="/projects",
     *     tags={"Projects"},
     *     summary="Get list of projects",
     *     description="Retrieve paginated list of projects with tasks, members, invitations and chats",
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
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/Project")
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Project::class);

        $params = $this->getPaginationParams($request);

        return ProjectResource::collection($this->projectReadRepository->findByCustomerIdPaginatedWithStats($request->user()->id, $params->page, $params->perPage));
    }

    /**
     * @OA\Post(
     *     path="/projects",
     *     tags={"Projects"},
     *     summary="Create a new project",
     *     description="Create a new project with the provided data",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "status"},
     *             @OA\Property(property="name", type="string", example="New Marketing Campaign"),
     *             @OA\Property(property="description", type="string", example="Social media marketing campaign for Q4"),
     *             @OA\Property(property="status", type="string", enum={"active", "completed", "on_hold"}, example="active"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-09-21"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-31"),
     *             @OA\Property(property="budget", type="number", format="float", example=15000.50)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Project created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     )
     * )
     */
    public function store(CreateProjectDto $dto, Request $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $projectUseCaseDto = \App\Infrastructure\API\DTO\CreateProjectUseCaseDto::fromCreateProjectDto($dto, $request->user()->id);

        return response()->json(new ProjectResource($this->createProjectUseCase->execute($projectUseCaseDto->toArray())), Response::HTTP_CREATED);

    }

    /**
     * @OA\Get(
     *     path="/projects/{id}",
     *     tags={"Projects"},
     *     summary="Get project details",
     *     description="Retrieve detailed information about a specific project including tasks, members, invitations and chats",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     )
     * )
     */
    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);

        return new ProjectResource($this->projectReadRepository->findById($project->id));
    }

    /**
     * @OA\Put(
     *     path="/projects/{id}",
     *     tags={"Projects"},
     *     summary="Update project",
     *     description="Update an existing project",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Updated Marketing Campaign"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="status", type="string", enum={"active", "completed", "on_hold"}, example="active"),
     *             @OA\Property(property="budget", type="number", format="float", example=20000.00)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     )
     * )
     */
    public function update(CreateProjectDto $dto, Project $project): ProjectResource
    {
        $this->authorize('update', $project);

        $updateProjectDto = \App\Infrastructure\API\DTO\UpdateProjectUseCaseDto::fromCreateProjectDto($dto);

        $project = $this->updateProjectUseCase->execute($project->id, $updateProjectDto->toArray());

        return new ProjectResource($project);
    }

    /**
     * @OA\Patch(
     *     path="/projects/{id}/complete",
     *     tags={"Projects"},
     *     summary="Mark project as completed",
     *     description="Change project status to completed",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project marked as completed",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     )
     * )
     */
    public function complete(Project $project): ProjectResource
    {

        $this->authorize('update', $project);

        $project = $this->projectWriteRepository->updateStatus($project->id, 'completed');

        return new ProjectResource($project);
    }

    /**
     * @OA\Delete(
     *     path="/projects/{id}",
     *     tags={"Projects"},
     *     summary="Delete project",
     *     description="Delete an existing project",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Project deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project deleted")
     *         )
     *     )
     * )
     */
    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $this->projectWriteRepository->delete($project->id);

        return response()->json(['message' => 'Project deleted'], Response::HTTP_NO_CONTENT);
    }
}
