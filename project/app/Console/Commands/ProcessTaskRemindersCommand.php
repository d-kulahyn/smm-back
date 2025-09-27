<?php

namespace App\Console\Commands;

use App\Infrastructure\Job\NotificationJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Domain\Notification\TaskReminderPostCallback;
use App\Domain\Repository\TaskReminderReadRepositoryInterface;
use App\Infrastructure\Notification\Messages\TaskReminderMessage;

class ProcessTaskRemindersCommand extends Command
{
    protected $signature   = 'tasks:process-reminders';
    protected $description = 'Processing task reminders and sending notifications to users.';


    public function __construct(
        private readonly TaskReminderReadRepositoryInterface $taskReminderReadRepository,
    ) {
        parent::__construct();
    }


    public function handle(): int
    {
        foreach ($this->taskReminderReadRepository->batchPendingReminders() as $reminder) {
            try {
                NotificationJob::dispatch(
                    [$reminder->reminder_type],
                    (new TaskReminderMessage($reminder->message ?? "You need to do your task {$reminder?->task->title}."))->create(),
                    [
                        'class' => TaskReminderPostCallback::class,
                        'data'  => ['taskReminderId' => $reminder->id],
                    ]
                );
            } catch (\Throwable $e) {
                Log::error('Failed to send task reminder', [
                    'reminder_id' => $reminder->id,
                    'error'       => $e->getMessage(),
                ]);
            }
        }

        return Command::SUCCESS;
    }
}
