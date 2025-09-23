<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class InitChunkedUploadDto extends Data
{
    public function __construct(
        public string $filename,
        public string $fileType,
        public int $fileSize,
        public string $fileableType,
        public int $fileableId,
        public int $userId,
        public string $mimeType,
        public ?string $description = null,
        public ?int $chunkSize = null
    ) {}

    public static function rules(): array
    {
        return [
            'filename'      => 'required|string|max:255',
            'file_size'     => 'required|integer|min:1|max:10737418240', // Max 10GB
            'chunk_size'    => 'integer|min:1024|max:10485760', // 1KB to 10MB
            'fileable_type' => 'required|string',
            'fileable_id'   => 'required|integer',
            'description'   => 'nullable|string|max:500',
            'file_type'     => 'required|string|in:image,video,document,audio,other',
            'mime_type'     => 'required|string|max:100',
        ];
    }
}
