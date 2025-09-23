<?php

namespace App\Providers;

use App\Domain\Repository\ActivityWriteRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\CustomerWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\ProjectWriteRepositoryInterface;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Domain\Repository\MediaFileWriteRepositoryInterface;
use App\Domain\Repository\TaskReminderReadRepositoryInterface;
use App\Domain\Repository\TaskReminderWriteRepositoryInterface;
use App\Infrastructure\Persistence\EloquentActivityLogWriteWriteRepository;
use App\Infrastructure\Persistence\EloquentCustomerReadRepository;
use App\Infrastructure\Persistence\EloquentCustomerWriteRepository;
use App\Infrastructure\Persistence\EloquentProjectReadRepository;
use App\Infrastructure\Persistence\EloquentProjectWriteRepository;
use App\Infrastructure\Persistence\EloquentChatReadRepository;
use App\Infrastructure\Persistence\EloquentChatWriteRepository;
use App\Infrastructure\Persistence\EloquentTaskReadRepository;
use App\Infrastructure\Persistence\EloquentTaskWriteRepository;
use App\Infrastructure\Persistence\EloquentMediaFileReadRepository;
use App\Infrastructure\Persistence\EloquentMediaFileWriteRepository;
use App\Infrastructure\Persistence\EloquentTaskReminderReadRepository;
use App\Infrastructure\Persistence\EloquentTaskReminderWriteRepository;
use App\Infrastructure\Service\Interface\SecurityCodeStorageInterface;
use App\Infrastructure\Service\SecurityCodeRedisStorage;
use Illuminate\Foundation\Application;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //security code
        $this->app->bind(
            SecurityCodeStorageInterface::class,
            SecurityCodeRedisStorage::class
        );

        //customer
        $this->app->bind(CustomerWriteRepositoryInterface::class, EloquentCustomerWriteRepository::class);
        $this->app->bind(CustomerReadRepositoryInterface::class, EloquentCustomerReadRepository::class);

        //project
        $this->app->bind(ProjectWriteRepositoryInterface::class, EloquentProjectWriteRepository::class);
        $this->app->bind(ProjectReadRepositoryInterface::class, EloquentProjectReadRepository::class);

        //chat
        $this->app->bind(ChatWriteRepositoryInterface::class, EloquentChatWriteRepository::class);
        $this->app->bind(ChatReadRepositoryInterface::class, EloquentChatReadRepository::class);

        //task
        $this->app->bind(TaskWriteRepositoryInterface::class, EloquentTaskWriteRepository::class);
        $this->app->bind(TaskReadRepositoryInterface::class, EloquentTaskReadRepository::class);

        //media file
        $this->app->bind(MediaFileWriteRepositoryInterface::class, EloquentMediaFileWriteRepository::class);
        $this->app->bind(MediaFileReadRepositoryInterface::class, EloquentMediaFileReadRepository::class);

        //task reminder
        $this->app->bind(TaskReminderWriteRepositoryInterface::class, EloquentTaskReminderWriteRepository::class);
        $this->app->bind(TaskReminderReadRepositoryInterface::class, EloquentTaskReminderReadRepository::class);

        //project members
        $this->app->bind(\App\Domain\Repository\ProjectMemberWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectMemberWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\ProjectMemberReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectMemberReadRepository::class);

        //project invitations
        $this->app->bind(\App\Domain\Repository\ProjectInvitationWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectInvitationWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\ProjectInvitationReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectInvitationReadRepository::class);

        //content plan
        $this->app->bind(\App\Domain\Repository\ContentPlanWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentContentPlanWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\ContentPlanReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentContentPlanReadRepository::class);

        //storybook
        $this->app->bind(\App\Domain\Repository\StorybookWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentStorybookWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\StorybookReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentStorybookReadRepository::class);

        //social media accounts
        $this->app->bind(\App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentSocialMediaAccountWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\SocialMediaAccountReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentSocialMediaAccountReadRepository::class);

        //project reports
        $this->app->bind(\App\Domain\Repository\ProjectReportWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectReportWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\ProjectReportReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentProjectReportReadRepository::class);

        //social metrics
        $this->app->bind(\App\Domain\Repository\SocialMetricWriteRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentSocialMetricWriteRepository::class);
        $this->app->bind(\App\Domain\Repository\SocialMetricReadRepositoryInterface::class, \App\Infrastructure\Persistence\EloquentSocialMetricReadRepository::class);

        $this->app->bind(ActivityWriteRepositoryInterface::class, EloquentActivityLogWriteWriteRepository::class);

        $this->app->bind(Factory::class, function (Application $app) {
            return (new Factory())->withServiceAccount($app->basePath('firebase.json'));
        });

        $this->app->register(\L5Swagger\L5SwaggerServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        bcscale(2);

        // Регистрация Policy для контроля доступа на уровне ресурсов
        Gate::policy(\App\Models\Project::class, \App\Domain\Policies\ProjectPolicy::class);
        Gate::policy(\App\Models\Task::class, \App\Domain\Policies\TaskPolicy::class);
        Gate::policy(\App\Models\Chat::class, \App\Domain\Policies\ChatPolicy::class);
        Gate::policy(\App\Models\MediaFile::class, \App\Domain\Policies\MediaFilePolicy::class);
    }
}
