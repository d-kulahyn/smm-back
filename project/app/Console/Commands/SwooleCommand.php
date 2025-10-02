<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class SwooleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swoole:serve
                            {action=start : Action to perform (start|stop|restart|status|reload)}
                            {--host=0.0.0.0 : The host address to bind to}
                            {--port=8080 : The port to bind to}
                            {--workers=auto : Number of worker processes}
                            {--task-workers=auto : Number of task worker processes}
                            {--max-requests=1000 : Max requests per worker}
                            {--watch : Watch for file changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage Swoole server for Laravel Octane';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'start':
                return $this->startServer();
            case 'stop':
                return $this->stopServer();
            case 'restart':
                return $this->restartServer();
            case 'status':
                return $this->serverStatus();
            case 'reload':
                return $this->reloadServer();
            default:
                $this->error("Unknown action: {$action}");
                return 1;
        }
    }

    /**
     * Start Swoole server
     */
    protected function startServer()
    {
        $this->info('🚀 Starting Swoole server...');

        $command = [
            'php', 'artisan', 'octane:start',
            '--server=swoole',
            '--host=' . $this->option('host'),
            '--port=' . $this->option('port'),
            '--workers=' . $this->option('workers'),
            '--task-workers=' . $this->option('task-workers'),
            '--max-requests=' . $this->option('max-requests'),
        ];

        if ($this->option('watch')) {
            $command[] = '--watch';
        }

        $this->line('Command: ' . implode(' ', $command));

        $process = Process::start($command);

        if ($process->running()) {
            $this->info('✅ Swoole server started successfully!');
            $this->info("🌐 Available at: http://{$this->option('host')}:{$this->option('port')}");
            $this->info('📊 Workers: ' . $this->option('workers') . ', Task Workers: ' . $this->option('task-workers'));
            $this->info('⚡ Max requests per worker: ' . $this->option('max-requests'));
            return 0;
        } else {
            $this->error('❌ Failed to start Swoole server');
            return 1;
        }
    }

    /**
     * Stop Swoole server
     */
    protected function stopServer()
    {
        $this->info('🛑 Stopping Swoole server...');

        $result = Process::run(['php', 'artisan', 'octane:stop']);

        if ($result->successful()) {
            $this->info('✅ Swoole server stopped');
            return 0;
        } else {
            $this->error('❌ Error stopping server: ' . $result->errorOutput());
            return 1;
        }
    }

    /**
     * Restart Swoole server
     */
    protected function restartServer()
    {
        $this->info('🔄 Restarting Swoole server...');

        $this->stopServer();
        sleep(2);
        return $this->startServer();
    }

    /**
     * Check Swoole server status
     */
    protected function serverStatus()
    {
        $this->info('📊 Checking Swoole server status...');

        $result = Process::run(['php', 'artisan', 'octane:status']);

        $this->line($result->output());

        // Additional check via curl
        $host = $this->option('host');
        $port = $this->option('port');

        $curlResult = Process::run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', "http://{$host}:{$port}"]);

        if ($curlResult->output() === '200') {
            $this->info("✅ Server is responding at http://{$host}:{$port}");
        } else {
            $this->warn("⚠️ Server is not responding at http://{$host}:{$port}");
        }

        return 0;
    }

    /**
     * Reload Swoole workers
     */
    protected function reloadServer()
    {
        $this->info('⚡ Reloading Swoole workers...');

        $result = Process::run(['php', 'artisan', 'octane:reload']);

        if ($result->successful()) {
            $this->info('✅ Workers reloaded');
            return 0;
        } else {
            $this->error('❌ Error reloading workers: ' . $result->errorOutput());
            return 1;
        }
    }
}
