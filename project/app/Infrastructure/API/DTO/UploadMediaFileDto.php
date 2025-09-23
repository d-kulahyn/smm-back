<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class UploadMediaFileDto extends Data
{
    public function __construct(
        public string $fileable_type,
        public int $fileable_id,
        public ?string $description = null,
    ) {}

    public static function rules(): array
    {
        return [
            'file'          => [
                'required',
                'file',
                'max:10240', // 10MB max
                'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp3,wav,mp4,ogg,m4a', // Allowed file types
            ],
            'fileable_type' => 'required|in:project,task',
            'fileable_id'   => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $fileableType = request()->input('fileable_type');

                    // Validate that the fileable entity exists
                    $modelClass = match($fileableType) {
                        'project' => \App\Models\Project::class,
                        'task' => \App\Models\Task::class,
                        default => null
                    };

                    if ($modelClass && !$modelClass::find($value)) {
                        $fail("The selected {$fileableType} does not exist.");
                    }
                },
            ],
            'description'   => 'nullable|string|max:255',
        ];
    }

    public static function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.max' => 'The file size must not exceed 10MB.',
            'file.mimes' => 'The file must be one of the following types: jpg, jpeg, png, gif, pdf, doc, docx, mp3, wav, mp4, ogg, m4a.',
            'fileable_type.in' => 'The fileable type must be either project or task.',
            'fileable_id.integer' => 'The fileable ID must be a valid integer.',
        ];
    }

    /**
     * Get the model class for the fileable type
     */
    public function getFileableModelClass(): string
    {
        return match($this->fileable_type) {
            'project' => \App\Models\Project::class,
            'task' => \App\Models\Task::class,
            default => throw new \InvalidArgumentException('Invalid fileable type: ' . $this->fileable_type)
        };
    }
}
