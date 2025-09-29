<?php

namespace App\Providers;

use App\Domain\Policies\ChatPolicy;
use App\Domain\Policies\MediaFilePolicy;
use App\Domain\Policies\ProjectInvitationPolicy;
use App\Domain\Policies\ProjectPolicy;
use App\Domain\Policies\TaskPolicy;
use App\Domain\Repository\ActivityWriteRepositoryInterface;
use App\Domain\Repository\ChatMemberReadRepositoryInterface;
use App\Domain\Repository\ChatMemberWriteRepositoryInterface;
use App\Domain\Repository\ContentPlanReadRepositoryInterface;
use App\Domain\Repository\ContentPlanWriteRepositoryInterface;
use App\Domain\Repository\CustomerReadRepositoryInterface;
use App\Domain\Repository\CustomerWriteRepositoryInterface;
use App\Domain\Repository\ProjectInvitationReadRepositoryInterface;
use App\Domain\Repository\ProjectInvitationWriteRepositoryInterface;
use App\Domain\Repository\ProjectMemberReadRepositoryInterface;
use App\Domain\Repository\ProjectMemberWriteRepositoryInterface;
use App\Domain\Repository\ProjectReadRepositoryInterface;
use App\Domain\Repository\ProjectReportReadRepositoryInterface;
use App\Domain\Repository\ProjectReportWriteRepositoryInterface;
use App\Domain\Repository\ProjectWriteRepositoryInterface;
use App\Domain\Repository\ChatReadRepositoryInterface;
use App\Domain\Repository\ChatWriteRepositoryInterface;
use App\Domain\Repository\SocialMediaAccountReadRepositoryInterface;
use App\Domain\Repository\SocialMediaAccountWriteRepositoryInterface;
use App\Domain\Repository\SocialMetricReadRepositoryInterface;
use App\Domain\Repository\SocialMetricWriteRepositoryInterface;
use App\Domain\Repository\StorybookReadRepositoryInterface;
use App\Domain\Repository\StorybookWriteRepositoryInterface;
use App\Domain\Repository\TaskReadRepositoryInterface;
use App\Domain\Repository\TaskWriteRepositoryInterface;
use App\Domain\Repository\MediaFileReadRepositoryInterface;
use App\Domain\Repository\MediaFileWriteRepositoryInterface;
use App\Domain\Repository\TaskReminderReadRepositoryInterface;
use App\Domain\Repository\TaskReminderWriteRepositoryInterface;
use App\Infrastructure\Persistence\EloquentActivityLogWriteWriteRepository;
use App\Infrastructure\Persistence\EloquentChatMemberReadRepository;
use App\Infrastructure\Persistence\EloquentChatMemberWriteRepository;
use App\Infrastructure\Persistence\EloquentContentPlanReadRepository;
use App\Infrastructure\Persistence\EloquentContentPlanWriteRepository;
use App\Infrastructure\Persistence\EloquentCustomerReadRepository;
use App\Infrastructure\Persistence\EloquentCustomerWriteRepository;
use App\Infrastructure\Persistence\EloquentProjectInvitationReadRepository;
use App\Infrastructure\Persistence\EloquentProjectInvitationWriteRepository;
use App\Infrastructure\Persistence\EloquentProjectMemberReadRepository;
use App\Infrastructure\Persistence\EloquentProjectMemberWriteRepository;
use App\Infrastructure\Persistence\EloquentProjectReadRepository;
use App\Infrastructure\Persistence\EloquentProjectReportReadRepository;
use App\Infrastructure\Persistence\EloquentProjectReportWriteRepository;
use App\Infrastructure\Persistence\EloquentProjectWriteRepository;
use App\Infrastructure\Persistence\EloquentChatReadRepository;
use App\Infrastructure\Persistence\EloquentChatWriteRepository;
use App\Infrastructure\Persistence\EloquentSocialMediaAccountReadRepository;
use App\Infrastructure\Persistence\EloquentSocialMediaAccountWriteRepository;
use App\Infrastructure\Persistence\EloquentSocialMetricReadRepository;
use App\Infrastructure\Persistence\EloquentSocialMetricWriteRepository;
use App\Infrastructure\Persistence\EloquentStorybookReadRepository;
use App\Infrastructure\Persistence\EloquentStorybookWriteRepository;
use App\Infrastructure\Persistence\EloquentTaskReadRepository;
use App\Infrastructure\Persistence\EloquentTaskWriteRepository;
use App\Infrastructure\Persistence\EloquentMediaFileReadRepository;
use App\Infrastructure\Persistence\EloquentMediaFileWriteRepository;
use App\Infrastructure\Persistence\EloquentTaskReminderReadRepository;
use App\Infrastructure\Persistence\EloquentTaskReminderWriteRepository;
use App\Infrastructure\Service\Broadcaster\RedisStreamBroadcaster;
use App\Infrastructure\Service\Interface\SecurityCodeStorageInterface;
use App\Infrastructure\Service\SecurityCodeRedisStorage;
use App\Models\Chat;
use App\Models\MediaFile;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\Task;
use Illuminate\Foundation\Application;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Gate;
use L5Swagger\L5SwaggerServiceProvider;

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
        $this->app->bind(ProjectMemberWriteRepositoryInterface::class,
            EloquentProjectMemberWriteRepository::class);
        $this->app->bind(ProjectMemberReadRepositoryInterface::class,
            EloquentProjectMemberReadRepository::class);

        //project invitations
        $this->app->bind(ProjectInvitationWriteRepositoryInterface::class,
            EloquentProjectInvitationWriteRepository::class);
        $this->app->bind(ProjectInvitationReadRepositoryInterface::class,
            EloquentProjectInvitationReadRepository::class);

        //content plan
        $this->app->bind(ContentPlanWriteRepositoryInterface::class,
            EloquentContentPlanWriteRepository::class);
        $this->app->bind(ContentPlanReadRepositoryInterface::class,
            EloquentContentPlanReadRepository::class);

        //storybook
        $this->app->bind(StorybookWriteRepositoryInterface::class,
            EloquentStorybookWriteRepository::class);
        $this->app->bind(StorybookReadRepositoryInterface::class,
            EloquentStorybookReadRepository::class);

        //social media accounts
        $this->app->bind(SocialMediaAccountWriteRepositoryInterface::class,
            EloquentSocialMediaAccountWriteRepository::class);
        $this->app->bind(SocialMediaAccountReadRepositoryInterface::class,
            EloquentSocialMediaAccountReadRepository::class);

        //project reports
        $this->app->bind(ProjectReportWriteRepositoryInterface::class,
            EloquentProjectReportWriteRepository::class);
        $this->app->bind(ProjectReportReadRepositoryInterface::class,
            EloquentProjectReportReadRepository::class);

        //social metrics
        $this->app->bind(SocialMetricWriteRepositoryInterface::class,
            EloquentSocialMetricWriteRepository::class);
        $this->app->bind(SocialMetricReadRepositoryInterface::class,
            EloquentSocialMetricReadRepository::class);

        $this->app->bind(ChatMemberWriteRepositoryInterface::class, EloquentChatMemberWriteRepository::class);
        $this->app->bind(ChatMemberReadRepositoryInterface::class, EloquentChatMemberReadRepository::class);


        $this->app->bind(ActivityWriteRepositoryInterface::class, EloquentActivityLogWriteWriteRepository::class);

        $this->app->bind(Factory::class, function (Application $app) {
            return (new Factory())->withServiceAccount($app->basePath('firebase.json'));
        });

        $this->app->register(L5SwaggerServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        bcscale(2);

        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(Chat::class, ChatPolicy::class);
        Gate::policy(MediaFile::class, MediaFilePolicy::class);
        Gate::policy(ProjectInvitation::class, ProjectInvitationPolicy::class);

        Broadcast::extend('stream', fn ($app, array $config) => new RedisStreamBroadcaster($config));
    }
}
