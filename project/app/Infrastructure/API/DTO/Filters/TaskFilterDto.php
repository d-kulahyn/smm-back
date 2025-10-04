<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO\Filters;

class TaskFilterDto extends BaseFilterDto
{
    public function __construct(
        public readonly ?string $status = null,
        public readonly ?string $priority = null,
        public readonly ?int $assigned_to = null,
        public readonly ?bool $overdue = null,
        public readonly ?int $project_id = null,
        public readonly ?string $search = null,
        public readonly ?int $customer_id = null,
    ) {}

    protected function getFilterableFields(): array
    {
        return [
            'status',
            'priority',
            'assigned_to',
            'overdue',
            'project_id',
            'search',
            'customer_id',
        ];
    }

    protected function getValidationRules(): array
    {
        return [
            'status'      => 'in:pending,in_progress,on_hold,cancelled',
            'priority'    => 'in:low,medium,high,urgent',
            'assigned_to' => 'integer|min:1',
            'overdue'     => 'boolean',
            'project_id'  => 'integer|min:1',
            'search'      => 'string|max:255',
            'customer_id' => 'integer|min:1',
        ];
    }

    protected function setFilters(array $filters): static
    {
        return new static(
            status     : $filters['status'] ?? null,
            priority   : $filters['priority'] ?? null,
            assigned_to: isset($filters['assigned_to']) ? (int)$filters['assigned_to'] : null,
            overdue    : isset($filters['overdue']) ? filter_var($filters['overdue'], FILTER_VALIDATE_BOOLEAN) : null,
            project_id : isset($filters['project_id']) ? (int)$filters['project_id'] : null,
            search     : $filters['search'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'status'      => $this->status,
            'priority'    => $this->priority,
            'assigned_to' => $this->assigned_to,
            'overdue'     => $this->overdue,
            'project_id'  => $this->project_id,
            'search'      => $this->search,
        ];
    }

    public function hasFilters(): bool
    {
        return !empty($this->getActiveFilters());
    }

    public function hasStatusFilter(): bool
    {
        return $this->status !== null;
    }

    public function hasPriorityFilter(): bool
    {
        return $this->priority !== null;
    }

    public function hasAssignedToFilter(): bool
    {
        return $this->assigned_to !== null;
    }

    public function hasOverdueFilter(): bool
    {
        return $this->overdue !== null;
    }

    public function hasProjectFilter(): bool
    {
        return $this->project_id !== null;
    }

    public function hasSearchFilter(): bool
    {
        return $this->search !== null && $this->search !== '';
    }
}
