<?php

declare(strict_types=1);

namespace App\Infrastructure\API\Controllers;

use App\Domain\Enum\StatusEnum;
use App\Domain\Repository\ActivityReadRepositoryInterface;
use App\Domain\Repository\ActivityWriteRepositoryInterface;
use App\Infrastructure\API\DTO\StatusUpdateBatchDTO;
use App\Infrastructure\API\Resource\ActivityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Activities",
 *     description="Activity log and tracking endpoints"
 * )
 */
readonly class ActivityController
{

    public function __construct(
        private ActivityReadRepositoryInterface $activityReadRepository,
        private ActivityWriteRepositoryInterface $activityWriteRepository
    ) {}

    /**
     * @OA\Get(
     *     path="/activities",
     *     tags={"Activities"},
     *     summary="Get pending activities",
     *     description="Retrieve list of pending activities for authenticated user",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/Activity")
     *             )
     *         )
     *     )
     * )
     */
    public function index(): AnonymousResourceCollection
    {
        return ActivityResource::collection($this->activityReadRepository->list(StatusEnum::PENDING, auth()->id()));
    }

    /**
     * @OA\Patch(
     *     path="/activities/status-batch",
     *     tags={"Activities"},
     *     summary="Update multiple activity statuses",
     *     description="Update status for multiple activities in a single request",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ids", "status"},
     *             @OA\Property(
     *                 property="ids",
     *                 type="array",
     *                 @OA\Items(type="integer"),
     *                 example={1, 2, 3},
     *                 description="Array of activity IDs to update"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"pending", "paid", "read", "declined"},
     *                 example="read",
     *                 description="New status for activities"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Statuses updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Statuses updated successfully"),
     *             @OA\Property(property="status", type="string", example="read")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function statusBatch(StatusUpdateBatchDTO $statusUpdateBatchDTO): JsonResponse
    {
        $this->activityWriteRepository->updateStatuses($statusUpdateBatchDTO->ids, auth()->id(), $statusUpdateBatchDTO->status);

        return response()->json([
            'message' => 'Statuses updated successfully',
            'status' => $statusUpdateBatchDTO->status->value,
        ]);
    }
}
