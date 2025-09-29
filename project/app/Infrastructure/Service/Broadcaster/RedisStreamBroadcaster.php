<?php

declare(strict_types=1);

namespace App\Infrastructure\Service\Broadcaster;

use Illuminate\Broadcasting\Broadcasters\Broadcaster;
use Illuminate\Support\Facades\Redis;

class RedisStreamBroadcaster extends Broadcaster
{
    protected array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function auth($request)
    {
        return true;
    }

    public function validAuthenticationResponse($request, $result)
    {
        return true;
    }

    public function broadcast(array $channels, $event, array $payload = [])
    {
        $connection = $this->config['connection'] ?? 'default';

        foreach ($channels as $channel) {
            Redis::connection($connection)->executeRaw([
                'XADD',
                $channel,
                '*',
                'event', $event,
                'data', json_encode($payload, JSON_UNESCAPED_UNICODE)
            ]);
        }
    }
}
