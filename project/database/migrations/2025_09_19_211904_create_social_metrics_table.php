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
        Schema::create('social_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'youtube', 'twitter', 'linkedin', 'telegram', 'all']);
            $table->string('metric_type'); // content, audience, engagement, reach, advertising
            $table->string('metric_name'); // stories_count, posts_count, followers_growth, etc.
            $table->bigInteger('metric_value');
            $table->date('metric_date');
            $table->boolean('is_manual')->default(true);
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // Дополнительные данные метрики
            $table->timestamps();

            $table->unique(['project_id', 'platform', 'metric_name', 'metric_date']);
            $table->index(['project_id', 'platform', 'metric_date']);
            $table->index(['metric_type', 'platform']);
            $table->index(['is_manual', 'metric_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_metrics');
    }
};
