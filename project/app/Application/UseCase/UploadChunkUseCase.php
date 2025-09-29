<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Event\MediaFileUploadedEvent;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Infrastructure\API\DTO\UploadChunkDto;
use App\Infrastructure\API\Resource\MediaFileResource;
use App\Infrastructure\Service\ChunkedUploadMetadata;
use App\Infrastructure\Service\FileStorageService;
use App\Models\Project;

readonly class UploadChunkUseCase
{
    public function __construct(
        private FileStorageService $fileStorageService,
        private ChunkedUploadMetadata $metadata,
        private MediaFileReadRepositoryInterface $fileReadRepository,
        private ProjectReadRepositoryInterface $projectReadRepository,
    ) {}

    public function execute(UploadChunkDto $dto): array
    {
        $uploadData = $dto->validateUploadSession($this->metadata);

        $this->fileStorageService->appendChunk($uploadData['file_path'], $dto->chunk);

        $this->metadata->addUploadedChunk($dto->uploadId, $dto->chunkNumber);

        $currentSize = $this->fileStorageService->getFileSize($uploadData['file_path']);

        $media = $this->fileReadRepository->findById((int)$dto->uploadId);

        if ($this->metadata->areAllChunksUploaded($dto->uploadId) && $media->fileable_type === Project::class) {
            event(new MediaFileUploadedEvent($dto->userId, new MediaFileResource($media),
                $this->projectReadRepository->findById($media->fileable_id)));
        }

        return [
            'message'         => 'Chunk uploaded successfully',
            'uploaded_chunks' => count($uploadData['uploaded_chunks']) + 1,
            'total_chunks'    => $uploadData['total_chunks'],
            'current_size'    => $currentSize,
        ];
    }
}
