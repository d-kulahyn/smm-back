<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Infrastructure\API\DTO\UploadMediaFileUseCaseDto;
use App\Infrastructure\API\DTO\SendVoiceMessageUseCaseDto;
use App\Infrastructure\API\DTO\VoiceMessageUseCaseDto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    /**
     * Generate unique file name with timestamp prefix
     */
    public function generateFileName(UploadedFile $file): string
    {
        return time().'_'.$file->getClientOriginalName();
    }

    /**
     * Store voice message file and return file path
     */
    public function storeVoiceMessage(UploadedFile $file): string
    {
        $fileName = $this->generateFileName($file);

        return $file->storeAs('voice_messages', $fileName, 'public');
    }

    /**
     * Store general media file and return file path
     */
    public function storeMediaFile(UploadedFile $file, string $directory = 'media'): string
    {
        $fileName = $this->generateFileName($file);

        return $file->storeAs($directory, $fileName, 'public');
    }

    /**
     * Create media file DTO for upload use case
     */
    public function createUploadDto(
        UploadedFile $file,
        int $uploadedBy,
        string $fileableType,
        int $fileableId,
        ?string $description = null,
        string $directory = 'media'
    ): UploadMediaFileUseCaseDto {
        $filePath = $this->storeMediaFile($file, $directory);

        return UploadMediaFileUseCaseDto::fromUploadedFile(
            filePath: $filePath,
            fileName: $this->generateFileName($file),
            originalName: $file->getClientOriginalName(),
            fileType: $this->getFileTypeFromMime($file->getMimeType()),
            mimeType: $file->getMimeType(),
            fileSize: $file->getSize(),
            uploadedBy: $uploadedBy,
            fileableType: $fileableType,
            fileableId: $fileableId,
            description: $description
        );
    }

    /**
     * Create voice message DTO for chat
     */
    public function createVoiceMessageDto(
        UploadedFile $file,
        int $projectId,
        int $customerId
    ): VoiceMessageUseCaseDto {
        $filePath = $this->storeVoiceMessage($file);

        return VoiceMessageUseCaseDto::fromVoiceFile(
            projectId : $projectId,
            customerId: $customerId,
            filePath  : $filePath,
            fileName  : $file->getClientOriginalName(),
            fileSize  : $file->getSize()
        );
    }

    /**
     * Create media file data array for chat message
     */
    public function createChatMediaData(
        UploadedFile $file,
        int $projectId,
        int $customerId,
        string $messageType = 'file'
    ): array {
        $directory = match ($messageType) {
            'voice' => 'voice_messages',
            'image' => 'images',
            default => 'files'
        };

        $filePath = $this->storeMediaFile($file, $directory);

        return [
            'project_id'   => $projectId,
            'customer_id'  => $customerId,
            'message'      => $messageType === 'voice' ? 'Voice message' : 'File attachment',
            'message_type' => $messageType,
            'sender_type'  => 'customer',
            'file_path'    => $filePath,
            'file_name'    => $file->getClientOriginalName(),
            'file_size'    => (string)$file->getSize(),
        ];
    }

    /**
     * Get file type from mime type
     */
    private function getFileTypeFromMime(string $mimeType): string
    {
        return match (true) {
            str_starts_with($mimeType, 'image/') => 'image',
            str_starts_with($mimeType, 'audio/') => 'audio',
            str_starts_with($mimeType, 'video/') => 'video',
            str_starts_with($mimeType, 'application/pdf') => 'document',
            str_starts_with($mimeType, 'application/') => 'document',
            str_starts_with($mimeType, 'text/') => 'document',
            default => 'file'
        };
    }

    public function createEmptyFile(string $fileName, string $directory = 'media'): string
    {
        $filePath = $directory . '/' . $fileName;
        // Ensure the directory exists
        Storage::disk('public')->makeDirectory($directory);
        // Create an empty file
        Storage::disk('public')->put($filePath, '');

        return $filePath;
    }

    /**
     * Append chunk to file at specific position
     */
    public function appendChunk(string $filePath, UploadedFile $chunk): void
    {
        if (!Storage::disk('public')->exists($filePath)) return;

        $chunkContent = file_get_contents($chunk->getPathname());

        Storage::disk('public')->append($filePath, $chunkContent);
    }

    /**
     * Get file size
     */
    public function getFileSize(string $filePath): int
    {
        return Storage::disk('public')->exists($filePath)
            ? Storage::disk('public')->size($filePath)
            : 0;
    }
}
