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
            // Убираем FlushTemporaryContainerInstances - он не работает с этим событием
        ],

        RequestHandled::class => [
            // Убираем FlushTemporaryContainerInstances - он не работает с этим событием
        ],

        RequestTerminated::class => [
            FlushUploadedFiles::class,
            CollectGarbage::class,
            // Убираем FlushTemporaryContainerInstances - он не работает с этим событием
        ],

        TaskReceived::class => [
            //
        ],

        TaskTerminated::class => [
            CollectGarbage::class,
        ],

        TickReceived::class => [
            //
        ],

        TickTerminated::class => [
            //
        ],

        OperationTerminated::class => [
            // Оставляем только здесь - FlushTemporaryContainerInstances работает только с OperationTerminated
            FlushTemporaryContainerInstances::class,
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

    /*
    |--------------------------------------------------------------------------
    | Swoole Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure some of the Swoole settings used by your server.
    |
    */

    'swoole' => [
        'options' => [
            'log_file' => storage_path('logs/swoole_http.log'),
            'package_max_length' => 10 * 1024 * 1024,
            // ЭКСТРЕМАЛЬНО агрессивные настройки - перезапуск после каждого запроса
            'max_request' => 1, // Перезапускать воркер после КАЖДОГО запроса
            'max_conn' => 1024,
            'task_max_request' => 1, // Перезапускать task воркер после каждой задачи
            'task_enable_coroutine' => false,
            'enable_coroutine' => false,
            // Максимально агрессивная сборка мусора
            'reload_async' => true,
            'max_wait_time' => 1,
            'heartbeat_check_interval' => 1,
            'heartbeat_idle_time' => 2,
            'heartbeat_idle_time' => 10,
            'dispatch_mode' => 2, // Перенаправление по процессам
            'worker_num' => 1, // Один воркер для минимизации состояния
            'task_worker_num' => 1,
