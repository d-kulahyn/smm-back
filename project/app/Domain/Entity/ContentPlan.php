<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class ContentPlan extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $content_type,
        public readonly string $platform,
        public readonly ?string $scheduled_date,
        public readonly string $status,
        public readonly ?int $assigned_to,
        public readonly ?string $content_text,
        public readonly ?array $hashtags,
        public readonly ?array $mentions,
        public readonly ?string $link_url,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function getFormattedHashtags(): string
    {
        if (!$this->hashtags) {
            return '';
        }

        return implode(' ', array_map(fn($tag) => '#' . $tag, $this->hashtags));
    }

    public function getFormattedMentions(): string
    {
        if (!$this->mentions) {
            return '';
        }

        return implode(' ', array_map(fn($mention) => '@' . $mention, $this->mentions));
    }
}
