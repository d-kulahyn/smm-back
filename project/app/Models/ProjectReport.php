<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'report_date',
        'period_type',
        'manual_metrics',
        'automated_metrics',
        'social_metrics',
        'summary_data',
        'is_generated',
        'generated_at',
    ];

    protected $casts = [
        'manual_metrics' => 'array',
        'automated_metrics' => 'array',
        'social_metrics' => 'array',
        'summary_data' => 'array',
        'is_generated' => 'boolean',
        'generated_at' => 'datetime',
        'report_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function socialMetrics(): HasMany
    {
        return $this->hasMany(SocialMetric::class, 'project_id', 'project_id')
                   ->whereDate('metric_date', $this->report_date);
    }

    public function getTotalReach(): int
    {
        $reach = 0;

        if ($this->automated_metrics) {
            foreach ($this->automated_metrics as $platform => $metrics) {
                $reach += $metrics['reach'] ?? 0;
            }
        }

        if ($this->manual_metrics) {
            $reach += $this->manual_metrics['manual_reach'] ?? 0;
        }

        return $reach;
    }

    public function getTotalEngagement(): int
    {
        $engagement = 0;

        if ($this->automated_metrics) {
            foreach ($this->automated_metrics as $platform => $metrics) {
                $engagement += ($metrics['likes'] ?? 0) +
                              ($metrics['comments'] ?? 0) +
                              ($metrics['shares'] ?? 0);
            }
        }

        return $engagement;
    }

    public function getEngagementRate(): float
    {
        $reach = $this->getTotalReach();
        $engagement = $this->getTotalEngagement();

        return $reach > 0 ? round(($engagement / $reach) * 100, 2) : 0.0;
    }

    public function scopeForPeriod($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('report_date', [$startDate, $endDate]);
    }

    public function scopeByPeriodType($query, string $periodType)
    {
        return $query->where('period_type', $periodType);
    }
}
