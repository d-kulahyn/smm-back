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
        Schema::create('social_media_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'youtube', 'twitter', 'linkedin', 'telegram']);
            $table->string('account_name');
            $table->string('account_id');
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('account_metadata')->nullable(); // Данные аккаунта (фото, подписчики и т.д.)
            $table->json('permissions')->nullable(); // Права доступа к API платформы
            $table->timestamps();

            $table->unique(['project_id', 'platform', 'account_id']);
            $table->index(['project_id', 'platform']);
            $table->index(['platform', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_media_accounts');
    }
};
