<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->date('report_date');
            $table->enum('period_type', ['daily', 'weekly', 'monthly', 'custom'])->default('monthly');
            $table->json('manual_metrics')->nullable(); // Мануально введенные метрики
            $table->json('automated_metrics')->nullable(); // Автоматически собранные метрики
            $table->json('social_metrics')->nullable(); // Метрики по платформам
            $table->json('summary_data')->nullable(); // Сводные данные и расчеты
            $table->boolean('is_generated')->default(false);
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'report_date', 'period_type']);
            $table->index(['project_id', 'period_type']);
            $table->index(['report_date', 'period_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_reports');
    }
};
