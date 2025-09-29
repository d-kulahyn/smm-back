<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Infrastructure\API\DTO\InitChunkedUploadDto;
use App\Infrastructure\API\DTO\UploadMediaFileUseCaseDto;
use App\Infrastructure\Service\ChunkedUploadMetadata;
use App\Infrastructure\Service\FileStorageService;

readonly class InitChunkedUploadUseCase
{
    public function __construct(
        private FileStorageService $fileManager,
        private ChunkedUploadMetadata $metadata,
        private UploadMediaFileUseCase $uploadMediaFileUseCase
    ) {}

    public function execute(InitChunkedUploadDto $dto): array
    {
        $chunkSize = $dto->chunkSize ?? 1048576;
        $totalChunks = ceil($dto->fileSize / $chunkSize);

        $filePath = $this->fileManager->createEmptyFile($dto->filename);

        $uploadData = new UploadMediaFileUseCaseDto(
            file_path    : $filePath,
            file_name    : $dto->filename,
            original_name: $dto->filename,
            file_type    : $dto->fileType,
            mime_type    : $dto->mimeType,
            file_size    : $dto->fileSize,
            uploaded_by  : $dto->userId,
            fileable_type: $dto->fileableType,
            fileable_id  : $dto->fileableId,
            description  : $dto->description,
        );

        $media = $this->uploadMediaFileUseCase->execute($uploadData, false);

        $this->metadata->store((string)$media->id, [
            'chunk_size'    => $chunkSize,
            'total_chunks'  => $totalChunks,
        ]);

        return [
            'upload_id'    => $media->id,
        ];
    }
}
