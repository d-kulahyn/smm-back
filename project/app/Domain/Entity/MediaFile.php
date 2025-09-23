<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class MediaFile extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $original_name,
        public readonly string $file_path,
        public readonly string $file_type,
        public readonly string $mime_type,
        public readonly int $file_size,
        public readonly int $fileable_id,
        public readonly string $fileable_type,
        public readonly int $uploaded_by,
        public readonly ?string $description = null,
        public readonly ?array $metadata = null,
        public readonly ?string $created_at = null,
        public readonly ?string $updated_at = null,
        public readonly ?int $id = null,
    ) {}

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isAudio(): bool
    {
        return str_starts_with($this->mime_type, 'audio/');
    }

    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    public function isDocument(): bool
    {
        return str_starts_with($this->mime_type, 'application/') ||
            str_starts_with($this->mime_type, 'text/');
    }

    public function getFormattedSize(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFileExtension(): string
    {
        return pathinfo($this->original_name, PATHINFO_EXTENSION);
    }

    public function getUrlPath(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
