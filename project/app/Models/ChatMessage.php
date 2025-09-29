<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'project_id',
        'customer_id',
        'message',
        'message_type',
        'sender_type',
        'file_path',
        'file_name',
        'file_size',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'file_size' => 'integer',
    ];

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function reads(): HasMany
    {
        return $this->hasMany(ChatMessageRead::class);
    }

    public function isReadBy(int $customerId): bool
    {
        return $this->reads()->where('customer_id', $customerId)->exists();
    }
}
