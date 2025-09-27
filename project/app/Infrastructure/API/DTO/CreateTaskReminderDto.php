<?php

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class CreateTaskReminderDto extends Data
{

    public function __construct(
        public int $hours_before,
    ) {}

    public function rules(): array
    {
        return [
            'hours_before' => 'required|integer|min:1|max:72',
        ];
    }
}
