<?php

return [
    /*
    |--------------------------------------------------------------------------
    | HTTP Server Configuration
    |--------------------------------------------------------------------------
    */
    'http' => [
        'host' => env('SWOOLE_HTTP_HOST', '0.0.0.0'),
        'port' => env('SWOOLE_HTTP_PORT', 8080),
        'public_path' => env('SWOOLE_HTTP_DOCUMENT_ROOT', base_path('public')),
        'options' => [
            // Основные настройки производительности
            'reactor_num' => function_exists('openswoole_cpu_num') ? openswoole_cpu_num() * 2 : 2,
            'worker_num' => env('SWOOLE_HTTP_WORKER_NUM', function_exists('openswoole_cpu_num') ? openswoole_cpu_num() * 2 : 4),
            'task_worker_num' => env('SWOOLE_HTTP_TASK_WORKER_NUM', function_exists('openswoole_cpu_num') ? openswoole_cpu_num() : 2),

            // Настройки буферов и памяти
            'socket_buffer_size' => env('SWOOLE_SOCKET_BUFFER_SIZE', 2 * 1024 * 1024),
            'package_max_length' => env('SWOOLE_PACKAGE_MAX_LENGTH', 2 * 1024 * 1024),
            'buffer_output_size' => 2 * 1024 * 1024,

            // Настройки соединений
            'max_conn' => 10000,
            'max_request' => env('OCTANE_MAX_REQUESTS', 1000),
            'max_wait_time' => 60,
            'heartbeat_check_interval' => 30,
            'heartbeat_idle_time' => 600,

            // Оптимизация производительности
            'enable_coroutine' => env('SWOOLE_ENABLE_COROUTINE', true),
            'max_coroutine' => env('SWOOLE_MAX_COROUTINE', 100000),
            'enable_preemptive_scheduler' => true,
            'hook_flags' => defined('SWOOLE_HOOK_ALL') ? SWOOLE_HOOK_ALL : (defined('OPENSWOOLE_HOOK_ALL') ? OPENSWOOLE_HOOK_ALL : 0),

            // Статические файлы
            'enable_static_handler' => env('SWOOLE_HTTP_ENABLE_STATIC_HANDLER', true),
            'document_root' => env('SWOOLE_HTTP_DOCUMENT_ROOT', base_path('public')),
            'static_handler_locations' => ['/static', '/favicon.ico', '/robots.txt'],

            // Сжатие
            'http_compression' => true,
            'http_compression_level' => 6,
            'compression_min_length' => 20,

            // Безопасность и стабильность
            'open_cpu_affinity' => true,
            'tcp_fastopen' => true,
            'open_tcp_nodelay' => true,
            'backlog' => 8192,

            // Логирование
            'log_level' => defined('SWOOLE_LOG_ERROR') ? SWOOLE_LOG_ERROR : (defined('OPENSWOOLE_LOG_ERROR') ? OPENSWOOLE_LOG_ERROR : 4),
            'log_rotation' => defined('SWOOLE_LOG_ROTATION_DAILY') ? SWOOLE_LOG_ROTATION_DAILY : (defined('OPENSWOOLE_LOG_ROTATION_DAILY') ? OPENSWOOLE_LOG_ROTATION_DAILY : 4),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | WebSocket Server Configuration
    |--------------------------------------------------------------------------
    */
    'websocket' => [
        'enabled' => env('SWOOLE_WEBSOCKET_ENABLED', true),
        'host' => env('SWOOLE_WEBSOCKET_HOST', '0.0.0.0'),
        'port' => env('SWOOLE_WEBSOCKET_PORT', 8082),
        'handler' => \App\Services\SwooleWebSocketServer::class,
        'ping_interval' => 25000, // 25 секунд
        'ping_timeout' => 60000,  // 60 секунд
        'max_frame_size' => 2097152, // 2MB
        'compression' => true,
        'options' => [
            'heartbeat_idle_time' => 600,
            'heartbeat_check_interval' => 60,
            'max_conn' => 10000,
            'task_worker_num' => function_exists('openswoole_cpu_num') ? openswoole_cpu_num() * 2 : 4,
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Task Server Configuration (улучшенная конфигурация)
    |--------------------------------------------------------------------------
    */
    'task' => [
        'enable_coroutine' => true,
        'max_request' => 1000,
        'worker_num' => env('SWOOLE_TASK_WORKER_NUM', function_exists('openswoole_cpu_num') ? openswoole_cpu_num() * 2 : 4),
        'max_wait_time' => 60,
        'dispatch_mode' => 2, // Оптимальный режим для Task Workers
        'task_tmpdir' => '/tmp/swoole_task',
        'task_max_request' => 1000,
        'task_ipc_mode' => defined('SWOOLE_IPC_UNIXSOCK') ? SWOOLE_IPC_UNIXSOCK : (defined('OPENSWOOLE_IPC_UNIXSOCK') ? OPENSWOOLE_IPC_UNIXSOCK : 1),
    ],

    /*
    |--------------------------------------------------------------------------
    | Process Configuration
    |--------------------------------------------------------------------------
    */
    'process' => [
        'max_memory' => 1024 * 1024 * 1024, // 1GB
        'memory_limit_check_interval' => 60,
    ],

    /*
    |--------------------------------------------------------------------------
    | SSL Configuration (для HTTPS)
    |--------------------------------------------------------------------------
    */
    'ssl' => [
        'cert_file' => env('SWOOLE_SSL_CERT'),
        'key_file' => env('SWOOLE_SSL_KEY'),
        'verify_peer' => false,
    ],
];
