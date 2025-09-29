<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\MediaFile;
use App\Domain\Repository\MediaFileWriteRepositoryInterface;
use App\Infrastructure\API\DTO\UploadMediaFileUseCaseDto;

readonly class UploadMediaFileUseCase
{
    public function __construct(
        private MediaFileWriteRepositoryInterface $mediaFileWriteRepository
    ) {}

    public function execute(
        UploadMediaFileUseCaseDto $uploadMediaFileUseCaseDto,
        bool $triggerEvent = true
    ): MediaFile {
        $media = new MediaFile(
            name         : $uploadMediaFileUseCaseDto->file_name,
            original_name: $uploadMediaFileUseCaseDto->original_name,
            file_path    : $uploadMediaFileUseCaseDto->file_path,
            file_type    : $uploadMediaFileUseCaseDto->file_type,
            mime_type    : $uploadMediaFileUseCaseDto->mime_type,
            file_size    : $uploadMediaFileUseCaseDto->file_size,
            fileable_id  : $uploadMediaFileUseCaseDto->fileable_id,
            fileable_type: $uploadMediaFileUseCaseDto->fileable_type,
            uploaded_by  : $uploadMediaFileUseCaseDto->uploaded_by,
            description  : $uploadMediaFileUseCaseDto->description,
        );

        return $this->mediaFileWriteRepository->save($media);
    }
}
