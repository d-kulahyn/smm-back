<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\MediaFile;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="MediaFile",
 *     type="object",
 *     title="Media File",
 *     description="Media file resource representation",
 *     @OA\Property(property="id", type="integer", example=1, description="Unique identifier"),
 *     @OA\Property(property="name", type="string", example="1640995200_document.pdf", description="Generated file name"),
 *     @OA\Property(property="original_name", type="string", example="document.pdf", description="Original file name"),
 *     @OA\Property(property="file_path", type="string", example="/storage/media/1640995200_document.pdf", description="Public file URL"),
 *     @OA\Property(property="file_type", type="string", enum={"image", "audio", "video", "document", "file"}, example="document", description="File type category"),
 *     @OA\Property(property="mime_type", type="string", example="application/pdf", description="MIME type"),
 *     @OA\Property(property="file_size", type="integer", example=1024000, description="File size in bytes"),
 *     @OA\Property(property="formatted_size", type="string", example="1.00 MB", description="Human readable file size"),
 *     @OA\Property(property="fileable_id", type="integer", example=1, description="Related entity ID"),
 *     @OA\Property(property="fileable_type", type="string", example="App\\Models\\Project", description="Related entity type"),
 *     @OA\Property(property="uploaded_by", type="integer", example=1, description="User who uploaded the file"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Project logo", description="File description"),
 *     @OA\Property(property="is_image", type="boolean", example=false, description="Whether file is an image"),
 *     @OA\Property(property="is_audio", type="boolean", example=false, description="Whether file is audio"),
 *     @OA\Property(property="metadata", type="object", nullable=true, description="Additional file metadata"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-12-31T23:59:59Z", description="Creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-12-31T23:59:59Z", description="Last update timestamp")
 * )
 */
class MediaFileResource extends JsonResource
{
    use FormatsDatesTrait;

    public function toArray($request): array
    {
        /** @var MediaFile $resource */
        $resource = $this->resource;

        return [
            'id'             => $resource->id,
            'name'           => $resource->name,
            'original_name'  => $resource->original_name,
            'file_path'      => Storage::url($resource->file_path),
            'file_type'      => $resource->file_type,
            'mime_type'      => $resource->mime_type,
            'file_size'      => $resource->file_size,
            'formatted_size' => $resource->getFormattedSize(),
            'fileable_id'    => $resource->fileable_id,
            'fileable_type'  => $resource->fileable_type,
            'uploaded_by'    => $resource->uploaded_by,
            'description'    => $resource->description,
            'is_image'       => $resource->isImage(),
            'is_audio'       => $resource->isAudio(),
            'metadata'       => $resource->metadata,
            'created_at'     => $this->formatCreatedAt($resource->created_at),
            'updated_at'     => $this->formatUpdatedAt($resource->updated_at),
        ];
    }
}
