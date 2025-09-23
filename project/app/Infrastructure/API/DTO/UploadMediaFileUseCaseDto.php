<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class UploadMediaFileUseCaseDto extends Data
{
    public function __construct(
        public string $file_path,
        public string $file_name,
        public string $original_name,
        public string $file_type,
        public string $mime_type,
        public int $file_size,
        public int $uploaded_by,
        public string $fileable_type,
        public int $fileable_id,
        public ?string $description = null,
        public ?array $metadata = null,
    ) {}
}
