<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'customers';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'need_to_change_password',
        'social_id',
        'social_type',
        'avatar',
        'social_type',
        'email_verified_at',
        'currency',
        'firebase_cloud_messaging_token',
        'push_notifications',
        'email_notifications',
        'role',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at'    => 'datetime',
        'permissions' => 'array',
    ];

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->getAttribute('password');
    }

    /**
     * @return bool
     */
    public function hasVerifiedEmail(): bool
    {
        return (bool)$this->email_verified_at;
    }

    protected static function newFactory(): CustomerFactory
    {
        return CustomerFactory::new();
    }

    public function friends(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'friends', 'customer_id', 'friend_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get project memberships for this customer
     */
    public function projectMemberships(): HasMany
    {
        return $this->hasMany(ProjectMember::class, 'user_id');
    }

    /**
     * Get projects where this customer is a member (through many-to-many)
     */
    public function memberProjects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members', 'user_id', 'project_id')
            ->withPivot(['role', 'permissions', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Check if customer is member of specific project
     */
    public function isMemberOf(int $projectId): bool
    {
        return $this->projectMemberships()->where('project_id', $projectId)->exists();
    }

    /**
     * Get customer's role in specific project
     */
    public function getRoleInProject(int $projectId): ?string
    {
        $membership = $this->projectMemberships()->where('project_id', $projectId)->first();
        return $membership?->role;
    }
}
