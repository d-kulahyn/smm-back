<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SocialMediaAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'platform',
        'account_name',
        'account_id',
        'access_token',
        'refresh_token',
        'expires_at',
        'is_active',
        'account_metadata',
        'permissions',
    ];

    protected $casts = [
        'account_metadata' => 'array',
        'permissions' => 'array',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }
}
