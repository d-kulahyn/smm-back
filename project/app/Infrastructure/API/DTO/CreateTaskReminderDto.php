<?php

namespace App\Infrastructure\API\DTO;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskReminderDto extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hours_before' => 'required|integer|min:1|max:72',
        ];
    }

    public function messages(): array
    {
        return [
            'hours_before.required' => 'Hours before field is required.',
            'hours_before.integer' => 'Hours before must be an integer.',
            'hours_before.min' => 'Hours before must be at least 1.',
            'hours_before.max' => 'Hours before cannot exceed 72.',
        ];
    }

    public function toArray(): array
    {
        return [
            'hours_before' => $this->validated()['hours_before'],
        ];
    }

    public function __get($key)
    {
        return $this->validated()[$key] ?? null;
    }
}
