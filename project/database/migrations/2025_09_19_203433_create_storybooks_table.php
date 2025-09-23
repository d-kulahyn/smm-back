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
        Schema::create('storybooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('story_type', ['image', 'video', 'boomerang', 'text'])->default('image');
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'youtube', 'twitter', 'linkedin', 'telegram']);
            $table->dateTime('scheduled_date')->nullable();
            $table->enum('status', ['draft', 'active', 'expired', 'scheduled'])->default('draft');
            $table->foreignId('assigned_to')->nullable()->constrained('customers')->onDelete('set null');
            $table->text('story_text')->nullable();
            $table->json('stickers')->nullable();
            $table->json('music_tracks')->nullable();
            $table->string('background_color', 7)->nullable(); // HEX color
            $table->string('template_id')->nullable();
            $table->integer('duration_seconds')->default(15);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
            $table->index(['scheduled_date', 'status']);
            $table->index(['platform', 'story_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('storybooks');
    }
};
