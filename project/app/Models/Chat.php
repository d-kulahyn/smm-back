<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'customer_id',
        'title',
        'description',
        'status',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function latestMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'id', 'chat_id')
            ->latest();
    }

    public function unreadMessagesCount(int $customerId): int
    {
        return $this->messages()
            ->where('customer_id', '!=', $customerId)
            ->whereDoesntHave('reads', function ($query) use ($customerId) {
                $query->where('customer_id', $customerId);
            })
            ->count();
    }
}
