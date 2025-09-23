<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use Spatie\LaravelData\Data;

class SocialMediaAccount extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $project_id,
        public readonly string $platform,
        public readonly string $account_name,
        public readonly string $account_id,
        public readonly ?string $access_token,
        public readonly ?string $refresh_token,
        public readonly ?string $expires_at,
        public readonly bool $is_active,
        public readonly ?array $account_metadata,
        public readonly ?array $permissions,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
    ) {}

    public function isConnected(): bool
    {
        return $this->is_active && $this->access_token !== null;
    }

    public function isTokenExpired(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return now()->greaterThan($this->expires_at);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->permissions) {
            return false;
        }

        return in_array($permission, $this->permissions);
    }

    public function canPost(): bool
    {
        return $this->hasPermission('publish_posts') || $this->hasPermission('manage_pages');
    }

    public function canCreateStories(): bool
    {
        return $this->hasPermission('publish_stories') || $this->hasPermission('manage_pages');
    }
}
