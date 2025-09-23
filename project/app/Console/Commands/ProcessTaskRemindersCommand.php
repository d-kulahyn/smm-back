<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessTaskRemindersCommand extends Command
{
    protected $signature = 'tasks:process-reminders';
    protected $description = 'Обработка и отправка напоминаний о задачах';


    public function handle(): int
    {
        $this->info('Начинаем обработку напоминаний о задачах...');

        $pendingReminders = $this->taskService->getPendingReminders();
        $processedCount = 0;

        foreach ($pendingReminders as $reminder) {
            try {
                $this->taskService->sendReminder($reminder);
                $processedCount++;

                $this->line("Напоминание отправлено: {$reminder->task->title} для {$reminder->customer->name}");

                Log::info('Task reminder sent', [
                    'reminder_id' => $reminder->id,
                    'task_id' => $reminder->task_id,
                    'customer_id' => $reminder->customer_id,
                ]);

            } catch (\Exception $e) {
                $this->error("Ошибка при отправке напоминания ID {$reminder->id}: {$e->getMessage()}");

                Log::error('Failed to send task reminder', [
                    'reminder_id' => $reminder->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Обработано напоминаний: {$processedCount} из " . $pendingReminders->count());

        return Command::SUCCESS;
    }
}
