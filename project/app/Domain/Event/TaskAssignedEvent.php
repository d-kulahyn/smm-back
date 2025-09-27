<?php

declare(strict_types=1);

namespace App\Domain\Event;

use App\Domain\Entity\Task;
use App\Domain\Enum\PermissionEnum;
use App\Infrastructure\API\Resource\TaskResource;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;


class TaskAssignedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $assignedToId,
        public Task $task
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::VIEW_ASSIGNED_TASKS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->assignedToId;
    }

    protected function getProjectId(): ?int
    {
        return $this->task->project_id;
    }

    public function broadcastWith(): array
    {
        return ['assigned_task' => new TaskResource($this->task)];
    }

    public function broadcastAs(): string
    {
        return 'taskAssigned';
    }

    public function broadcastOn(): array
    {
        return ["project"];
    }
}
