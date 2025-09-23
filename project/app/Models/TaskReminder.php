<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'customer_id',
        'remind_at',
        'reminder_type',
        'message',
        'is_sent',
        'sent_at',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'remind_at' => 'datetime',
        'sent_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function markAsSent(): void
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);
    }

    public function isDue(): bool
    {
        return $this->remind_at->isPast() && !$this->is_sent;
    }

    public function scopePending($query)
    {
        return $query->where('is_sent', false)
                    ->where('remind_at', '<=', now());
    }
}
