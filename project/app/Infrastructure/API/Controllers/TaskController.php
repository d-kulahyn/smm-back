<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\CreateTaskUseCase;
use App\Application\UseCase\CreateTaskReminderUseCase;
use App\Domain\Exception\TaskNotFoundException;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Infrastructure\API\DTO\CreateTaskDto;
use App\Infrastructure\API\DTO\CreateTaskReminderDto;
use App\Infrastructure\API\Resource\TaskResource;
use App\Infrastructure\API\Resource\TaskReminderResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Infrastructure\API\Helpers\ApiResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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
        private TaskReadRepositoryInterface $taskReadRepository,
        private TaskWriteRepositoryInterface $taskWriteRepository,
        private CreateTaskUseCase $createTaskUseCase,
        private CreateTaskReminderUseCase $createTaskReminderUseCase
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
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\Task::class);

        $params = $this->getPaginationParams($request);
        $filters = $request->only(['status', 'priority', 'assigned_to', 'overdue']);

        if ($request->has('project_id')) {
            $tasksPaginated = $this->taskReadRepository->findByProjectIdPaginated(
                $request->project_id,
                $filters,
                $params->page,
                $params->perPage
            );
        } else {
            $tasksPaginated = $this->taskReadRepository->findByCustomerIdPaginated(
                $request->user()->id,
                $filters,
                $params->page,
                $params->perPage
            );
        }

        return ApiResponseHelper::successWithPagination(
            $tasksPaginated
        );
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
    public function store(CreateTaskDto $dto, Request $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Task::class);

        $taskUseCaseDto = \App\Infrastructure\API\DTO\CreateTaskUseCaseDto::fromCreateTaskDto($dto, $request->user()->id);

        $task = $this->createTaskUseCase->execute($taskUseCaseDto->toArray());

        // Create reminder if specified
        if ($dto->reminder_before_hours && $dto->due_date) {
            $this->createTaskReminderUseCase->execute(
                $task->id,
                $request->user()->id,
                $dto->reminder_before_hours
            );
        }

        return ApiResponseHelper::success(
            new TaskResource($task),
            'Task created successfully',
            201
        );
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
    public function show(int $id): JsonResponse
    {
        $task = $this->taskReadRepository->findById($id);

        if (!$task) {
            throw new TaskNotFoundException();
        }

        $taskModel = \App\Models\Task::find($id);
        $this->authorize('view', $taskModel);

        return ApiResponseHelper::success(
            new TaskResource($task)
        );
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
    public function update(CreateTaskDto $dto, int $id): JsonResponse
    {
        $taskModel = \App\Models\Task::find($id);
        if (!$taskModel) {
            throw new TaskNotFoundException();
        }

        $this->authorize('update', $taskModel);

        $updateTaskDto = \App\Infrastructure\API\DTO\UpdateTaskUseCaseDto::fromCreateTaskDto($dto);

        $task = $this->taskWriteRepository->update($id, $updateTaskDto->toArray());

        return ApiResponseHelper::success(
            new TaskResource($task),
            'Task updated successfully'
        );
    }

    /**
     * @OA\Post(
     *     path="/tasks/{id}/complete",
     *     tags={"Tasks"},
     *     summary="Mark task as completed",
     *     description="Change task status to completed",
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
     *         description="Task marked as completed",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Task completed"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     )
     * )
     */
    public function complete(int $id): JsonResponse
    {
        $taskModel = \App\Models\Task::find($id);
        if (!$taskModel) {
            throw new TaskNotFoundException();
        }

        $this->authorize('update', $taskModel);

        $task = $this->taskWriteRepository->markAsCompleted($id);

        return ApiResponseHelper::success(
            new TaskResource($task),
            'Task completed'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $taskModel = \App\Models\Task::find($id);
        if (!$taskModel) {
            throw new TaskNotFoundException();
        }

        $this->authorize('delete', $taskModel);

        $deleted = $this->taskWriteRepository->delete($id);

        return ApiResponseHelper::success(
            null,
            'Task deleted'
        );
    }

    public function createReminder(CreateTaskReminderDto $dto, int $taskId): JsonResponse
    {
        $reminder = $this->createTaskReminderUseCase->execute(
            $taskId,
            request()->user()->id,
            $dto->hours_before
        );

        return ApiResponseHelper::success(
            new TaskReminderResource($reminder),
            'Reminder created successfully',
            201
        );
    }
}
