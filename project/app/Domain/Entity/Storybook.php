<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class Storybook extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $story_type,
        public readonly string $platform,
        public readonly ?string $scheduled_date,
        public readonly string $status,
        public readonly ?int $assigned_to,
        public readonly ?string $story_text,
        public readonly ?array $stickers,
        public readonly ?array $music_tracks,
        public readonly ?string $background_color,
        public readonly ?string $template_id,
        public readonly int $duration_seconds,
        public readonly ?array $metadata,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isVideo(): bool
    {
        return $this->story_type === 'video';
    }

    public function isImage(): bool
    {
        return $this->story_type === 'image';
    }

    public function isBoomerang(): bool
    {
        return $this->story_type === 'boomerang';
    }

    public function getFormattedDuration(): string
    {
        if ($this->duration_seconds <= 60) {
            return $this->duration_seconds . 's';
        }

        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;

        return $minutes . 'm ' . $seconds . 's';
    }
}
