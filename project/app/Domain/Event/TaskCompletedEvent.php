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

class TaskCompletedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $projectId,
        public Task $task
    ) {}

    protected function getRequiredPermission(): PermissionEnum
    {
        return PermissionEnum::MANAGE_PROJECT_TASKS;
    }

    protected function getResourceOwnerId(): ?int
    {
        return $this->task->customer_id;
    }

    protected function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function broadcastWith(): array
    {
        return ['completed_task' => new TaskResource($this->task)];
    }

    public function broadcastAs(): string
    {
        return 'taskCompleted';
    }

    public function broadcastOn(): array
    {
        return ["project.{$this->projectId}"];
    }
}
