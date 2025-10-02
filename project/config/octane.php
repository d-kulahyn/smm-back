<?php

use Laravel\Octane\Contracts\OperationTerminated;
use Laravel\Octane\Events\RequestHandled;
use Laravel\Octane\Events\RequestReceived;
use Laravel\Octane\Events\RequestTerminated;
use Laravel\Octane\Events\TaskReceived;
use Laravel\Octane\Events\TaskTerminated;
use Laravel\Octane\Events\TickReceived;
use Laravel\Octane\Events\TickTerminated;
use Laravel\Octane\Events\WorkerErrorOccurred;
use Laravel\Octane\Events\WorkerStarting;
use Laravel\Octane\Events\WorkerStopping;
use Laravel\Octane\Listeners\CloseMonologHandlers;
use Laravel\Octane\Listeners\CollectGarbage;
use Laravel\Octane\Listeners\DisconnectFromDatabases;
use Laravel\Octane\Listeners\EnsureUploadedFilesAreValid;
use Laravel\Octane\Listeners\EnsureUploadedFilesCanBeMoved;
use Laravel\Octane\Listeners\FlushOnce;
use Laravel\Octane\Listeners\FlushTemporaryContainerInstances;
use Laravel\Octane\Listeners\FlushUploadedFiles;
use Laravel\Octane\Listeners\ReportException;
use Laravel\Octane\Listeners\StopWorkerIfNecessary;
use Laravel\Octane\Octane;

return [
    /*
    |--------------------------------------------------------------------------
    | Octane Server
    |--------------------------------------------------------------------------
    |
    | This value determines the default "server" that will be used by Octane
    | when starting, restarting, or stopping your server via the CLI. You
    | are free to change this to the supported server of your choosing.
    |
    | Supported: "roadrunner", "swoole", "frankenphp"
    |
    */

    'server' => env('OCTANE_SERVER', 'swoole'),

    /*
    |--------------------------------------------------------------------------
    | Force HTTPS
    |--------------------------------------------------------------------------
    |
    | When this configuration value is set to "true", Octane will inform the
    | framework that all absolute links must be generated using the HTTPS
    | protocol. Otherwise your links may be generated using plain HTTP.
    |
    */

    'https' => env('OCTANE_HTTPS', false),

    /*
    |--------------------------------------------------------------------------
    | Octane Listeners
    |--------------------------------------------------------------------------
    |
    | Sets the listeners for the different server and worker events.
    |
    */

    'listeners' => [
        WorkerStarting::class => [
            EnsureUploadedFilesAreValid::class,
            EnsureUploadedFilesCanBeMoved::class,
        ],

        RequestReceived::class => [
            // Очистка состояния аутентификации перед каждым запросом
            \App\Listeners\ClearAuthenticationState::class,
        ],

        RequestHandled::class => [
            // Убираем проблемный слушатель
        ],

        RequestTerminated::class => [
            FlushUploadedFiles::class,
            // Сборка мусора для освобождения памяти
            CollectGarbage::class,
        ],

        TaskReceived::class => [
            // Обработка фоновых задач
        ],

        TaskTerminated::class => [
            CollectGarbage::class,
        ],

        TickReceived::class => [
            // Периодические задачи
        ],

        TickTerminated::class => [
            // Убираем проблемный слушатель
        ],

        OperationTerminated::class => [
            // Убираем проблемный слушатель до исправления
        ],

        WorkerErrorOccurred::class => [
            ReportException::class,
            StopWorkerIfNecessary::class,
        ],

        WorkerStopping::class => [
            CloseMonologHandlers::class,
            DisconnectFromDatabases::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Warm / Flush Bindings
    |--------------------------------------------------------------------------
    |
    | The bindings listed below will either be pre-warmed when a worker boots
    | or they will be flushed before every new request. Flushing a binding
    | will force the container to resolve that binding again when asked.
    |
    */

    'warm' => [
        'auth',
        'auth.driver',
        'cache',
        'cache.store',
        'config',
        'db',
        'encrypter',
        'files',
        'hash',
        'router',
        'session',
        'session.store',
        'translator',
        'url',
        'view',
    ],

    'flush' => [
        'auth',
        'auth.driver',
        'auth.password.broker',
        'translator',
        'session.store',
        'sanctum',
        'sanctum.guard',
        'sanctum.token',
        'sanctum.user',
        // Добавляем дополнительные биндинги для полной очистки
        'Laravel\Sanctum\Guard',
        'Laravel\Sanctum\PersonalAccessToken',
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Cache Table
    |--------------------------------------------------------------------------
    |
    | While using Octane, you may leverage the Octane cache, which is powered
    | by a simple in-memory table. You may set the maximum number of rows
    | that will be stored in the table before it begins forgetting rows.
    |
    */

    'cache' => [
        'rows' => 1000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Swoole Tables
    |--------------------------------------------------------------------------
    |
    | While using Swoole, you may leverage Swoole's powerful table feature
    | as a high-performance, shared memory cache. You may set the maximum
    | number of rows that will be stored in the table before it begins
    | forgetting rows.
    |
    */

    'tables' => [
        'example:1000' => [
            'name' => 'string:1000',
            'votes' => 'int',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Watching
    |--------------------------------------------------------------------------
    |
    | The following list of files and directories will be watched when using
    | the --watch option offered by Octane. If any of the directories and
    | files are changed, Octane will automatically reload your workers.
    |
    */

    'watch' => [
        'app',
        'bootstrap',
        'config',
        'database',
        'resources/**/*.php',
        'routes',
        '.env',
    ],

    /*
    |--------------------------------------------------------------------------
    | Garbage Collection Threshold
    |--------------------------------------------------------------------------
    |
    | When executing long-running tasks, such as processing queued jobs,
    | it may be beneficial to manually trigger garbage collection to
    | minimize the memory usage of your application over time.
    |
    */

    'garbage' => 50,

    /*
    |--------------------------------------------------------------------------
    | Maximum Execution Time
    |--------------------------------------------------------------------------
    |
    | The following setting configures the maximum execution time for requests
    | processed by Octane. You may set this value to 0 to indicate that
    | there should not be a time limit on Octane request execution.
    |
    */

    'max_execution_time' => 30,
];
