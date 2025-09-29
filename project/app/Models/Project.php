<?php

namespace App\Models;

use App\Domain\Enum\StatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'customer_id',
        'start_date',
        'end_date',
        'budget',
        'metadata',
        'avatar',
        'color'
    ];

    protected $casts = [
        'metadata' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function mediaFiles(): MorphMany
    {
        return $this->morphMany(MediaFile::class, 'fileable');
    }

    public function contentPlans(): HasMany
    {
        return $this->hasMany(ContentPlan::class);
    }

    public function storybooks(): HasMany
    {
        return $this->hasMany(Storybook::class);
    }

    public function socialMediaAccounts(): HasMany
    {
        return $this->hasMany(SocialMediaAccount::class);
    }

    public function projectReports(): HasMany
    {
        return $this->hasMany(ProjectReport::class);
    }

    public function socialMetrics(): HasMany
    {
        return $this->hasMany(SocialMetric::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function participants()
    {
        return $this->belongsToMany(Customer::class, 'project_members', 'project_id', 'user_id')
            ->withPivot(['role', 'permissions', 'joined_at'])
            ->withTimestamps();
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class);
    }

    public function isActive(): bool
    {
        return $this->status === StatusEnum::ACTIVE->value;
    }

    public function isCompleted(): bool
    {
        return $this->status === StatusEnum::COMPLETED->value;
    }
}
