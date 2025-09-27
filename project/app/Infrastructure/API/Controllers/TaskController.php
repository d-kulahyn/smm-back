<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\CreateTaskUseCase;
use App\Application\UseCase\CreateTaskReminderUseCase;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateTaskDto;
use App\Infrastructure\API\DTO\CreateTaskReminderDto;
use App\Infrastructure\API\DTO\CreateTaskUseCaseDto;
use App\Infrastructure\API\DTO\UpdateTaskUseCaseDto;
use App\Infrastructure\API\Resource\TaskResource;
use App\Infrastructure\API\Resource\TaskReminderResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Annotations as OA;
use App\Infrastructure\API\DTO\Filters\TaskFilterDto;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Tasks",
 *     description="Task management endpoints"
 * )
 */
class TaskController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private readonly TaskReadRepositoryInterface $taskReadRepository,
        private readonly TaskWriteRepositoryInterface $taskWriteRepository,
        private readonly CreateTaskUseCase $createTaskUseCase,
        private readonly CreateTaskReminderUseCase $createTaskReminderUseCase
    ) {}

    /**
     * @OA\Get(
     *     path="/tasks",
     *     tags={"Tasks"},
     *     summary="Get list of tasks",
     *     description="Retrieve paginated list of tasks with filtering options",
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
     *     @OA\Parameter(
     *         name="project_id",
     *         in="query",
     *         description="Filter by project ID",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "in_progress", "completed", "cancelled"})
     *     ),
     *     @OA\Parameter(
     *         name="priority",
     *         in="query",
     *         description="Filter by priority",
     *         required=false,
     *         @OA\Schema(type="string", enum={"low", "medium", "high", "urgent"})
     *     ),
     *     @OA\Parameter(
     *         name="assigned_to",
     *         in="query",
     *         description="Filter by assigned user ID",
     *         required=false,
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\Parameter(
     *         name="overdue",
     *         in="query",
     *         description="Filter overdue tasks",
     *         required=false,
     *         @OA\Schema(type="boolean", example=true)
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search in task title and description",
     *         required=false,
     *         @OA\Schema(type="string", example="social media")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Task")),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Task::class);

        $params = $this->getPaginationParams($request);
        $filters = TaskFilterDto::fromRequest($request);

        $tasksPaginated = $this->taskReadRepository->paginate($params, $filters);

        return TaskResource::collection($tasksPaginated);
    }

    /**
     * @OA\Post(
     *     path="/tasks",
     *     tags={"Tasks"},
     *     summary="Create a new task",
     *     description="Create a new task with the provided data",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "project_id"},
     *             @OA\Property(property="title", type="string", example="Create social media post"),
     *             @OA\Property(property="description", type="string", example="Design and create Instagram post for new product launch"),
     *             @OA\Property(property="project_id", type="integer", example=1),
     *             @OA\Property(property="assigned_to", type="integer", example=2),
     *             @OA\Property(property="priority", type="string", enum={"low", "medium", "high", "urgent"}, example="high"),
     *             @OA\Property(property="status", type="string", enum={"pending", "in_progress", "completed", "cancelled"}, example="pending"),
     *             @OA\Property(property="due_date", type="string", format="date", example="2025-09-30"),
     *             @OA\Property(property="reminder_before_hours", type="integer", example=24)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Task created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Task created successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     )
     * )
     */
    public function store(CreateTaskDto $dto, Request $request): TaskResource
    {
        $this->authorize('create', Task::class);

        $taskUseCaseDto = CreateTaskUseCaseDto::fromCreateTaskDto($dto, $request->user()->id);

        return new TaskResource($this->createTaskUseCase->execute($taskUseCaseDto));
    }

    /**
     * @OA\Get(
     *     path="/tasks/{id}",
     *     tags={"Tasks"},
     *     summary="Get task details",
     *     description="Retrieve detailed information about a specific task",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     )
     * )
     */
    public function show(Task $task): TaskResource
    {
        $this->authorize('view', $task);

        $taskEntity = $this->taskReadRepository->findById($task->id);

        return new TaskResource($taskEntity);
    }

    /**
     * @OA\Put(
     *     path="/tasks/{id}",
     *     tags={"Tasks"},
     *     summary="Update task",
     *     description="Update an existing task",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated task title"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="status", type="string", enum={"pending", "in_progress", "completed", "cancelled"}, example="in_progress"),
     *             @OA\Property(property="priority", type="string", enum={"low", "medium", "high", "urgent"}, example="high")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Task updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     )
     * )
     */
    public function update(CreateTaskDto $dto, Task $task): TaskResource
    {
        $this->authorize('update', $task);

        $updateTaskDto = UpdateTaskUseCaseDto::fromCreateTaskDto($dto);

        $task = $this->taskWriteRepository->update($task->id, $updateTaskDto);

        return new TaskResource($task);
    }

    /**
     * @OA\Delete(
     *     path="/tasks/{id}",
     *     tags={"Tasks"},
     *     summary="Delete task",
     *     description="Delete an existing task",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Task deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Task deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Task not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Task not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - User not authorized to delete this task",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="This action is unauthorized")
     *         )
     *     )
     * )
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $this->taskWriteRepository->delete($task->id);

        return response()->json(['message' => 'Task deleted successfully'], Response::HTTP_NO_CONTENT);
    }

    /**
     * @OA\Post(
     *     path="/tasks/{taskId}/reminders",
     *     tags={"Tasks"},
     *     summary="Create task reminder",
     *     description="Create a reminder for a specific task",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="taskId",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"hours_before"},
     *             @OA\Property(property="hours_before", type="integer", example=24, description="Hours before due date to send reminder")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reminder created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Reminder created successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/TaskReminder")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Task not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Task not found")
     *         )
     *     )
     * )
     */
    public function createReminder(CreateTaskReminderDto $dto, int $taskId): TaskReminderResource
    {
        $this->authorize('create', Task::class);

        $reminder = $this->createTaskReminderUseCase->execute($taskId, request()->user()->id, $dto->hours_before);

        return new TaskReminderResource($reminder);
    }
}
