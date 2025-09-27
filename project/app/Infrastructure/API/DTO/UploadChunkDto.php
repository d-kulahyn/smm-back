<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use App\Infrastructure\Service\ChunkedUploadMetadata;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;
use RuntimeException;
use Spatie\LaravelData\Data;

class UploadChunkDto extends Data
{
    public function __construct(
        public string $uploadId,
        public int $chunkNumber,
        public UploadedFile $chunk,
        public int $userId
    ) {}

    public static function fromRequest(Request $request): self
    {
        $validated = $request->validate(self::rules());

        return new self(
            uploadId   : $validated['upload_id'],
            chunkNumber: (int)$validated['chunk_number'],
            chunk      : $request->file('chunk'),
            userId     : $request->user()->id
        );
    }

    public static function rules(): array
    {
        return [
            'upload_id'    => 'required|string|uuid',
            'chunk_number' => 'required|integer|min:1',
            'chunk'        => 'required|file',
        ];
    }

    public function validateUploadSession(ChunkedUploadMetadata $metadata): array
    {
        $uploadData = $metadata->get($this->uploadId);
        if (!$uploadData) {
            throw new RuntimeException('Upload session not found or expired');
        }

        if ($uploadData['user_id'] !== $this->userId) {
            throw new RuntimeException('Unauthorized');
        }

        if ($this->chunkNumber > $uploadData['total_chunks']) {
            throw new InvalidArgumentException('Invalid chunk number');
        }

        if ($metadata->isChunkUploaded($this->uploadId, $this->chunkNumber)) {
            throw new InvalidArgumentException('Chunk already uploaded');
        }

        return $uploadData;
    }
}
