<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{

    public function generateFileName(UploadedFile $file): string
    {
        return time().'_' . uniqid() .$file->getClientOriginalName();
    }

    public function storeVoiceMessage(UploadedFile $file): string
    {
        $fileName = $this->generateFileName($file);

        return $file->storeAs('voice_messages', $fileName, env('DISK', 'public'));
    }

    public function storeMediaFile(UploadedFile $file, string $directory = 'media'): string
    {
        $fileName = $this->generateFileName($file);

        return $file->storeAs($directory, $fileName, env('DISK', 'public'));
    }

    public function createEmptyFile(string $fileName, string $directory = 'media'): string
    {
        $filePath = trim($directory, '/').'/'.$fileName;

        Storage::disk(env('DISK', 'public'))->makeDirectory($directory);
        Storage::disk(env('DISK', 'public'))->put($filePath, '');

        return $filePath;
    }

    public function appendChunk(string $filePath, UploadedFile $chunk): void
    {
        if (!Storage::disk(env('DISK', 'public'))->exists($filePath)) {
            return;
        }

        $chunkContent = file_get_contents($chunk->getPathname());

        Storage::disk(env('DISK', 'public'))->append($filePath, $chunkContent);
    }

    public function getFileSize(string $filePath): int
    {
        return Storage::disk(env('DISK', 'public'))->exists($filePath)
            ? Storage::disk(env('DISK', 'public'))->size($filePath)
            : 0;
    }

    public function delete(string $filePath): bool
    {
        return Storage::disk(env('DISK', 'public'))->delete($filePath);
    }
}
