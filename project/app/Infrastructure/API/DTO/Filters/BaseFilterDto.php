<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO\Filters;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

abstract class BaseFilterDto
{
    abstract protected function getFilterableFields(): array;

    abstract protected function getValidationRules(): array;

    public static function fromRequest(Request $request): static
    {
        $instance = new static();
        $filterableFields = $instance->getFilterableFields();

        $filters = $request->only($filterableFields);

        $validatedFilters = $instance->validateFilters($filters);

        return $instance->setFilters($validatedFilters);
    }

    protected function validateFilters(array $filters): array
    {
        $rules = $this->getValidationRules();

        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '';
        });

        if (!empty($filters) && !empty($rules)) {
            $validator = Validator::make($filters, $rules);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            return $validator->validated();
        }

        return $filters;
    }

    abstract protected function setFilters(array $filters): static;

    abstract public function toArray(): array;

    abstract public function hasFilters(): bool;

    public function getActiveFilters(): array
    {
        return array_filter($this->toArray(), function ($value) {
            return $value !== null && $value !== '';
        });
    }
}
