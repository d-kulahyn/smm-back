<?php

declare(strict_types=1);

namespace App\Infrastructure\Service;

use Illuminate\Support\Facades\Cache;

class ChunkedUploadMetadata
{
    private const CACHE_TTL_HOURS = 24;
    private const CACHE_PREFIX = 'chunk_upload_';

    public function store(string $uploadId, array $metadata): void
    {
        Cache::put(
            self::CACHE_PREFIX . $uploadId,
            $metadata,
            now()->addHours(self::CACHE_TTL_HOURS)
        );
    }

    public function get(string $uploadId): ?array
    {
        return Cache::get(self::CACHE_PREFIX . $uploadId);
    }

    public function addUploadedChunk(string $uploadId, int $chunkNumber): void
    {
        $metadata = $this->get($uploadId);
        if (!$metadata) {
            throw new \RuntimeException('Upload session not found');
        }

        $metadata['uploaded_chunks'][] = $chunkNumber;
        $metadata['uploaded_chunks'] = array_unique($metadata['uploaded_chunks']);
        sort($metadata['uploaded_chunks']);

        $this->store($uploadId, $metadata);
    }

    public function isChunkUploaded(string $uploadId, int $chunkNumber): bool
    {
        $metadata = $this->get($uploadId);
        if (!$metadata) {
            return false;
        }

        return in_array($chunkNumber, $metadata['uploaded_chunks']);
    }

    public function getMissingChunks(string $uploadId): array
    {
        $metadata = $this->get($uploadId);
        if (!$metadata) {
            return [];
        }

        return array_values(array_diff(
            range(1, $metadata['total_chunks']),
            $metadata['uploaded_chunks']
        ));
    }

    public function areAllChunksUploaded(string $uploadId): bool
    {
        $metadata = $this->get($uploadId);
        if (!$metadata) {
            return false;
        }

        return count($metadata['uploaded_chunks']) === $metadata['total_chunks'];
    }

    public function delete(string $uploadId): void
    {
        Cache::forget(self::CACHE_PREFIX . $uploadId);
    }
}
