<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateStorybookDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $title,
        public ?string $description = null,
        public string $story_type = 'image',
        public string $platform = 'instagram',
        public ?string $scheduled_date = null,
        public string $status = 'draft',
        public ?int $assigned_to = null,
        public ?string $story_text = null,
        public ?array $stickers = null,
        public ?array $music_tracks = null,
        public ?string $background_color = null,
        public ?string $template_id = null,
        public int $duration_seconds = 15,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id'       => 'required|exists:projects,id',
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'story_type'       => 'required|in:image,video,boomerang,text',
            'platform'         => 'required|in:instagram,facebook,tiktok,youtube,twitter,linkedin,telegram',
            'scheduled_date'   => 'nullable|date|after:now',
            'status'           => 'nullable|in:draft,active,expired,scheduled',
            'assigned_to'      => 'nullable|exists:customers,id',
            'story_text'       => 'nullable|string',
            'stickers'         => 'nullable|array',
            'music_tracks'     => 'nullable|array',
            'background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'template_id'      => 'nullable|string',
            'duration_seconds' => 'nullable|integer|min:1|max:60',
        ];
    }
}
