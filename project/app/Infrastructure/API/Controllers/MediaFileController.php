<?php

namespace App\Infrastructure\API\Controllers;

use App\Application\UseCase\UploadMediaFileUseCase;
use App\Application\UseCase\InitChunkedUploadUseCase;
use App\Application\UseCase\UploadChunkUseCase;
use App\Domain\Exception\MediaFileNotFoundException;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Domain\Repository\MediaFileWriteRepositoryInterface;
use App\Infrastructure\API\DTO\UploadMediaFileDto;
use App\Infrastructure\API\DTO\InitChunkedUploadDto;
use App\Infrastructure\API\DTO\UploadChunkDto;
use App\Infrastructure\API\Resource\MediaFileResource;
use App\Infrastructure\API\Traits\PaginationTrait;
use App\Infrastructure\Services\FileStorageService;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="Media Files",
 *     description="File upload and management endpoints"
 * )
 */
class MediaFileController extends Controller
{
    use AuthorizesRequests;
    use PaginationTrait;

    public function __construct(
        private MediaFileReadRepositoryInterface $mediaFileReadRepository,
        private MediaFileWriteRepositoryInterface $mediaFileWriteRepository,
        private UploadMediaFileUseCase $uploadMediaFileUseCase,
        private FileStorageService $fileStorageService,
        private InitChunkedUploadUseCase $initChunkedUploadUseCase,
        private UploadChunkUseCase $uploadChunkUseCase,
    ) {}

    /**
     * @OA\Get(
     *     path="/media-files",
     *     tags={"Media Files"},
     *     summary="Get list of media files",
     *     description="Retrieve paginated list of media files with filtering options",
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
     *     @OA\Parameter(
     *         name="file_type",
     *         in="query",
     *         description="Filter by file type",
     *         required=false,
     *         @OA\Schema(type="string", enum={"image", "audio", "video", "document", "file"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/MediaFile")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', MediaFile::class);

        $params = $this->getPaginationParams($request);

        return MediaFileResource::collection(
            $this->mediaFileReadRepository->findByUploadedByPaginated(
                $request->user()->id,
                $params->page,
                $params->perPage
            )
        );
    }

    /**
     * @OA\Get(
     *     path="/projects/{projectId}/media-files",
     *     tags={"Media Files"},
     *     summary="Get media files for a project",
     *     description="Retrieve paginated list of media files for a specific project",
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
     *     @OA\Parameter(
     *         name="file_type",
     *         in="query",
     *         description="Filter by file type",
     *         required=false,
     *         @OA\Schema(type="string", enum={"image", "audio", "video", "document", "file"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(ref="#/components/schemas/MediaFile")
     *             ),
     *             @OA\Property(property="pagination", ref="#/components/schemas/PaginationMeta")
     *         )
     *     )
     * )
     */
    public function getProjectMedia(Request $request, int $projectId): AnonymousResourceCollection
    {
        $this->authorize('viewAny', MediaFile::class);

        $params = $this->getPaginationParams($request);

        return MediaFileResource::collection(
            $this->mediaFileReadRepository->findByProjectIdPaginated(
                $projectId,
                $params->page,
                $params->perPage
            )
        );
    }

    /**
     * @OA\Post(
     *     path="/media-files",
     *     tags={"Media Files"},
     *     summary="Upload a media file",
     *     description="Upload a new media file to the system",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"file", "fileable_type", "fileable_id"},
     *                 @OA\Property(
     *                     property="file",
     *                     type="string",
     *                     format="binary",
     *                     description="File to upload (max 10MB)"
     *                 ),
     *                 @OA\Property(property="fileable_type", type="string", example="App\\Models\\Project"),
     *                 @OA\Property(property="fileable_id", type="integer", example=1),
     *                 @OA\Property(property="description", type="string", example="Project logo")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="File uploaded successfully",
     *         @OA\JsonContent(ref="#/components/schemas/MediaFile")
     *     )
     * )
     */
    public function store(UploadMediaFileDto $dto, Request $request): JsonResponse
    {
        $this->authorize('create', MediaFile::class);

        $file = $request->file('file');

        // Use FileStorageService to create DTO for use case
        $uploadDto = $this->fileStorageService->createUploadDto(
            $file,
            $request->user()->id,
            $dto->fileable_type,
            $dto->fileable_id,
            $dto->description
        );

        $mediaFile = $this->uploadMediaFileUseCase->execute($uploadDto);

        return response()->json(new MediaFileResource($mediaFile), Response::HTTP_CREATED);
    }

    /**
     * @OA\Get(
     *     path="/media-files/{id}",
     *     tags={"Media Files"},
     *     summary="Get media file details",
     *     description="Retrieve detailed information about a specific media file",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Media file ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/MediaFile")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Media file not found"
     *     )
     * )
     */
    public function show(MediaFile $mediaFile): JsonResponse
    {
        $this->authorize('view', $mediaFile);

        return response()->json(new MediaFileResource($mediaFile));
    }

    /**
     * @OA\Delete(
     *     path="/media-files/{id}",
     *     tags={"Media Files"},
     *     summary="Delete media file",
     *     description="Delete a media file from the system",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Media file ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="File deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Media file not found"
     *     )
     * )
     */
    public function destroy(MediaFile $mediaFile): JsonResponse
    {
        $this->authorize('delete', $mediaFile);

        // Delete physical file
        if (Storage::disk('public')->exists($mediaFile->file_path)) {
            Storage::disk('public')->delete($mediaFile->file_path);
        }

        // Delete database record
        $this->mediaFileWriteRepository->delete($mediaFile->id);

        return response()->json(['message' => 'File deleted successfully']);
    }

    /**
     * @OA\Get(
     *     path="/media-files/{id}/download",
     *     tags={"Media Files"},
     *     summary="Download media file",
     *     description="Download a media file",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Media file ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="File download"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Media file not found"
     *     )
     * )
     */
    public function download(MediaFile $mediaFile)
    {
        $this->authorize('view', $mediaFile);

        $mediaEntity = $this->mediaFileReadRepository->findById($mediaFile->id);

        if (!file_exists($mediaEntity->file_path)) {
            throw new MediaFileNotFoundException();
        }

        return response()->download($mediaEntity->file_path, $mediaFile->original_name);
    }

    /**
     * @OA\Post(
     *     path="/media-files/chunk/init",
     *     tags={"Media Files"},
     *     summary="Initialize chunked file upload",
     *     description="Initialize a new chunked file upload session",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"filename", "file_size", "fileable_type", "fileable_id"},
     *             @OA\Property(property="filename", type="string", example="large_video.mp4"),
     *             @OA\Property(property="file_size", type="integer", example=104857600),
     *             @OA\Property(property="chunk_size", type="integer", example=1048576),
     *             @OA\Property(property="fileable_type", type="string", example="App\\Models\\Project"),
     *             @OA\Property(property="fileable_id", type="integer", example=1),
     *             @OA\Property(property="description", type="string", example="Large video file")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Upload session initialized",
     *         @OA\JsonContent(
     *             @OA\Property(property="upload_id", type="string", example="uuid-string"),
     *             @OA\Property(property="total_chunks", type="integer", example=100),
     *             @OA\Property(property="chunk_size", type="integer", example=1048576),
     *             @OA\Property(property="file_path", type="string", example="media/uuid.mp4")
     *         )
     *     )
     * )
     */
    public function initChunkedUpload(InitChunkedUploadDto $dto): JsonResponse
    {
        $this->authorize('create', MediaFile::class);

        $result = $this->initChunkedUploadUseCase->execute($dto);

        return response()->json($result, Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/media-files/chunk/upload",
     *     tags={"Media Files"},
     *     summary="Upload file chunk",
     *     description="Upload a chunk of the file",
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"upload_id", "chunk_number", "chunk"},
     *                 @OA\Property(property="upload_id", type="string", example="uuid-string"),
     *                 @OA\Property(property="chunk_number", type="integer", example=1),
     *                 @OA\Property(property="chunk", type="string", format="binary", description="File chunk data")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Chunk uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Chunk uploaded successfully"),
     *             @OA\Property(property="uploaded_chunks", type="integer", example=5),
     *             @OA\Property(property="total_chunks", type="integer", example=100),
     *             @OA\Property(property="current_size", type="integer", example=5242880)
     *         )
     *     )
     * )
     */
    public function uploadChunk(Request $request): JsonResponse
    {
        $this->authorize('create', MediaFile::class);

        $dto = UploadChunkDto::fromRequest($request);
        $result = $this->uploadChunkUseCase->execute($dto);

        return response()->json($result);
    }
}
