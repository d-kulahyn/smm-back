<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SocialMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'platform',
        'metric_type',
        'metric_name',
        'metric_value',
        'metric_date',
        'is_manual',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_manual' => 'boolean',
        'metric_date' => 'date',
        'metric_value' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function isStoryMetric(): bool
    {
        return str_contains($this->metric_name, 'stories');
    }

    public function isPostMetric(): bool
    {
        return str_contains($this->metric_name, 'posts');
    }

    public function isEngagementMetric(): bool
    {
        return in_array($this->metric_name, ['likes', 'comments', 'shares', 'saves']);
    }

    public function scopeForPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    public function scopeForDate($query, string $date)
    {
        return $query->whereDate('metric_date', $date);
    }

    public function scopeManual($query)
    {
        return $query->where('is_manual', true);
    }

    public function scopeAutomated($query)
    {
        return $query->where('is_manual', false);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('metric_type', $type);
    }
}
