<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Event\MediaFileUploadedEvent;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Infrastructure\API\DTO\UploadChunkDto;
use App\Infrastructure\Services\ChunkedUploadMetadata;
use App\Infrastructure\Services\FileStorageService;

readonly class UploadChunkUseCase
{
    public function __construct(
        private FileStorageService $fileStorageService,
        private ChunkedUploadMetadata $metadata,
        private MediaFileReadRepositoryInterface $fileReadRepository,
    ) {}

    public function execute(UploadChunkDto $dto): array
    {
        // Validate upload session and permissions through DTO
        $uploadData = $dto->validateUploadSession($this->metadata);

        // Calculate position and append chunk
        $this->fileStorageService->appendChunk($uploadData['file_path'], $dto->chunk);

        // Update metadata
        $this->metadata->addUploadedChunk($dto->uploadId, $dto->chunkNumber);

        $currentSize = $this->fileStorageService->getFileSize($uploadData['file_path']);

        if ($this->metadata->areAllChunksUploaded($dto->uploadId)) {
            event(new MediaFileUploadedEvent($this->fileReadRepository->findById()));
        }

        return [
            'message' => 'Chunk uploaded successfully',
            'uploaded_chunks' => count($uploadData['uploaded_chunks']) + 1,
            'total_chunks' => $uploadData['total_chunks'],
            'current_size' => $currentSize
        ];
    }
}
