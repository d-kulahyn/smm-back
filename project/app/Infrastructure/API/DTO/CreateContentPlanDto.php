<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateContentPlanDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $title,
        public ?string $description = null,
        public string $content_type = 'post',
        public string $platform = 'instagram',
        public ?string $scheduled_date = null,
        public string $status = 'draft',
        public ?int $assigned_to = null,
        public ?string $content_text = null,
        public ?array $hashtags = null,
        public ?array $mentions = null,
        public ?string $link_url = null,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id'     => 'required|exists:projects,id',
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'content_type'   => 'required|in:post,story,reel,video,carousel,live',
            'platform'       => 'required|in:instagram,facebook,tiktok,youtube,twitter,linkedin,telegram',
            'scheduled_date' => 'nullable|date|after:now',
            'status'         => 'nullable|in:draft,pending_approval,approved,scheduled,published,rejected',
            'assigned_to'    => 'nullable|exists:customers,id',
            'content_text'   => 'nullable|string',
            'hashtags'       => 'nullable|array',
            'mentions'       => 'nullable|array',
            'link_url'       => 'nullable|url',
        ];
    }
}
