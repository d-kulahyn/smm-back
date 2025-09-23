<?php

declare(strict_types=1);

namespace App\Infrastructure\API\Resource\Traits;

use Carbon\Carbon;

trait FormatsDatesTrait
{
    /**
     * Format date for human-readable display
     */
    protected function formatDate($date): ?string
    {
        if (!$date) {
            return null;
        }

        if (is_string($date)) {
            $date = Carbon::parse($date);
        }

        // Format: "20 сентября 2025, 18:30"
        return $date->format('d M Y, H:i');
    }

    /**
     * Format date with relative time (e.g., "2 hours ago")
     */
    protected function formatDateWithRelative($date): ?array
    {
        if (!$date) {
            return null;
        }

        if (is_string($date)) {
            $date = Carbon::parse($date);
        }

        return [
            'formatted' => $this->formatDate($date),
            'relative' => $date->diffForHumans(),
            'iso' => $date->toISOString(),
        ];
    }

    /**
     * Format created_at field
     */
    protected function formatCreatedAt($createdAt): ?array
    {
        return $this->formatDateWithRelative($createdAt);
    }

    /**
     * Format updated_at field
     */
    protected function formatUpdatedAt($updatedAt): ?array
    {
        return $this->formatDateWithRelative($updatedAt);
    }
}
