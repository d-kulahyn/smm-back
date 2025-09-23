<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Storybook extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'story_type',
        'platform',
        'scheduled_date',
        'status',
        'assigned_to',
        'story_text',
        'stickers',
        'music_tracks',
        'background_color',
        'template_id',
        'duration_seconds',
        'metadata',
    ];

    protected $casts = [
        'stickers' => 'array',
        'music_tracks' => 'array',
        'metadata' => 'array',
        'scheduled_date' => 'datetime',
        'duration_seconds' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'assigned_to');
    }

    public function mediaFiles(): MorphMany
    {
        return $this->morphMany(MediaFile::class, 'fileable');
    }

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
}
