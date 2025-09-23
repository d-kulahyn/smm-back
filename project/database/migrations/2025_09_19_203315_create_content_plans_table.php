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
        Schema::create('content_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('content_type', ['post', 'story', 'reel', 'video', 'carousel', 'live'])->default('post');
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'youtube', 'twitter', 'linkedin', 'telegram']);
            $table->dateTime('scheduled_date')->nullable();
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'scheduled', 'published', 'rejected'])->default('draft');
            $table->foreignId('assigned_to')->nullable()->constrained('customers')->onDelete('set null');
            $table->text('content_text')->nullable();
            $table->json('hashtags')->nullable();
            $table->json('mentions')->nullable();
            $table->string('link_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
            $table->index(['scheduled_date', 'status']);
            $table->index(['platform', 'content_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_plans');
    }
};
