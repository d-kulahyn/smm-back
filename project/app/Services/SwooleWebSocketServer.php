<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Laravel\Octane\Facades\Octane;
use OpenSwoole\Table;
use OpenSwoole\WebSocket\Server;
use OpenSwoole\Http\Request;
use OpenSwoole\WebSocket\Frame;

class SwooleWebSocketServer
{
    private Server $server;
    private array  $rooms     = [];
    private array  $userRooms = [];

    private const MAX_ROOMS_PER_USER = 50;
    private const MAX_USERS_PER_ROOM = 1000;
    private const MAX_TOTAL_ROOMS    = 10000;

    private const CONNECTION_TIMEOUT = 300;

    private array $lastActivity = [];

    private const JOIN_ROOM  = 'join_room';
    private const LEAVE_ROOM = 'leave_room';

    public function createServer(string $host = '0.0.0.0', int $port = 8082): Server
    {
        $this->server = new Server($host, $port);

        $this->server->set([
            'max_connection'     => 10000,
            'max_request'        => 0,
            'package_max_length' => 8192,
        ]);

        $this->setupEventHandlers();
        $this->setupCleanupTimer();

        return $this->server;
    }

    private function setupCleanupTimer(): void
    {
        $this->server->tick(60000, function () {
            $this->cleanupInactiveConnections();
            $this->logMemoryUsage();
            $this->logStats();
        });
    }

    private function setupEventHandlers(): void
    {
        $this->server->on('open', [$this, 'onOpen']);
        $this->server->on('message', [$this, 'onMessage']);
        $this->server->on('close', [$this, 'onClose']);
    }

    public function onOpen(Server $server, \OpenSwoole\HTTP\Request $request): void
    {
        $fd = $request->fd;

        if (!$this->authenticateWithSanctum($this->extractAuthToken($request))) {
            $this->logWarning("Unauthorized WebSocket connection attempt", ['fd' => $fd]);
            $server->push($fd, json_encode([
                'event_name' => 'error',
                'error'      => 'Unauthorized',
                'timestamp'  => time(),
            ]));
            $server->disconnect($fd);

            return;
        }

        $this->logInfo("New WebSocket connection opened", ['fd' => $fd]);
    }

    private function extractAuthToken(\OpenSwoole\HTTP\Request $request): ?string
    {
        if (isset($request->get['token'])) {
            return $request->get['token'];
        }

        if (isset($request->header['authorization'])) {
            $auth = $request->header['authorization'];
            if (preg_match('/Bearer\s+(.+)/', $auth, $matches)) {
                return $matches[1];
            }

            return $auth;
        }

        if (isset($request->cookie['sanctum_token'])) {
            return $request->cookie['sanctum_token'];
        }

        return null;
    }

    private function authenticateWithSanctum(?string $token): bool
    {
        if (!$token) {
            return false;
        }

        try {
            $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

            if (!$accessToken) {
                $this->logDebug("Token not found in database", [
                    'token_preview' => substr($token, 0, 20).'...',
                ]);

                return false;
            }

            if ($accessToken->expires_at && $accessToken->expires_at->isPast()) {
                $this->logWarning("Expired token used", [
                    'token_id'   => $accessToken->id,
                    'expired_at' => $accessToken->expires_at,
                ]);

                return false;
            }

            $user = $accessToken->tokenable;
            if (!$user) {
                $this->logWarning("Token without user", ['token_id' => $accessToken->id]);

                return false;
            }

            $accessToken->forceFill(['last_used_at' => now()])->save();

            return true;
        } catch (\Exception $e) {
            $this->logError("Sanctum authentication failed", [
                'error'         => $e->getMessage(),
                'token_preview' => substr($token, 0, 20).'...',
            ]);

            return false;
        }
    }

    public function onMessage(Server $server, \OpenSwoole\WebSocket\Frame $frame): void
    {
        $fd = $frame->fd;

        $this->updateActivity($fd);

        try {
            $data = json_decode($frame->data, true, 512, JSON_THROW_ON_ERROR);

            if (strlen($frame->data) > 8192) {
                $this->logWarning("Message too large", [
                    'fd'   => $fd,
                    'size' => strlen($frame->data),
                ]);

                return;
            }

            $event = $data['event_name'] ?? 'unknown';

            $this->logInfo("Message received", [
                'fd'         => $fd,
                'event_name' => $event,
                'data_size'  => strlen($frame->data),
            ]);

            match ($event) {
                self::JOIN_ROOM => $this->handleJoinRoom($frame, $data),
                self::LEAVE_ROOM => $this->handleLeaveRoom($fd, $data),
                'ping' => $this->handlePing($fd),
                default => $this->logWarning("Unknown message type received", [
                    'fd'    => $fd,
                    'event' => $event,
                ])
            };
        } catch (\JsonException $e) {
            $this->logError("Invalid JSON in WebSocket message", [
                'fd'    => $fd,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function handleJoinRoom(\OpenSwoole\WebSocket\Frame $frame, array $data): void
    {
        if (!isset($data['room'])) {
            $this->logWarning("Room name not provided in join_room event", ['fd' => $frame->fd]);

            return;
        }

        $room = $data['room'];
        $fd = $frame->fd;

        if (!$this->canJoinRoom($fd, $data)) {
            $this->server->push($fd, json_encode([
                'event_name' => 'join_room_failed',
                'error'      => 'Limits exceeded',
                'timestamp'  => time(),
            ]));

            return;
        }

        $this->updateActivity($fd);

        if (!isset($this->rooms[$room])) {
            $this->rooms[$room] = [];
        }
        $this->rooms[$room][$fd] = time();

        if (!isset($this->userRooms[$fd])) {
            $this->userRooms[$fd] = [];
        }
        $this->userRooms[$fd][$room] = time();

        $this->logInfo("User joined room", [
            'fd'               => $fd,
            'room'             => $room,
            'total_in_room'    => count($this->rooms[$room]),
            'user_rooms_count' => count($this->userRooms[$fd]),
        ]);
    }

    private function canJoinRoom(int $fd, array $data): bool
    {
        $room = $data['room'];

        $userRoomsCount = count($this->userRooms[$fd] ?? []);
        if ($userRoomsCount >= self::MAX_ROOMS_PER_USER) {
            $this->logWarning("User exceeded max rooms limit", [
                'fd'            => $fd,
                'current_count' => $userRoomsCount,
                'limit'         => self::MAX_ROOMS_PER_USER,
            ]);

            return false;
        }

        $roomUsersCount = count($this->rooms[$room] ?? []);
        if ($roomUsersCount >= self::MAX_USERS_PER_ROOM) {
            $this->logWarning("Room exceeded max users limit", [
                'room'          => $room,
                'current_count' => $roomUsersCount,
                'limit'         => self::MAX_USERS_PER_ROOM,
            ]);

            return false;
        }

        if (count($this->rooms) >= self::MAX_TOTAL_ROOMS) {
            $this->logWarning("Server exceeded max rooms limit", [
                'current_count' => count($this->rooms),
                'limit'         => self::MAX_TOTAL_ROOMS,
            ]);

            return false;
        }

//        $type = $data['type'] ?? null;
//        $id = $data['id'] ?? null;
//
//        if (is_null($type)) {
//            $this->logWarning("Message type not provided in join_room event", ['fd' => $fd]);
//            return false;
//        }

        return true;
    }

    private function updateActivity(int $fd): void
    {
        $this->lastActivity[$fd] = time();
    }

    public function broadcastToRoom(string $room, array $message): void
    {
        if (!isset($this->rooms[$room])) {
            return;
        }

        $messageJson = json_encode($message);
        $deadConnections = [];

        $roomConnections = $this->rooms[$room];

        foreach ($roomConnections as $fd => $joinTime) {
            if ($this->server->isEstablished($fd)) {
                try {
                    $this->server->push($fd, $messageJson);
                    $this->updateActivity($fd);
                } catch (\Exception $e) {
                    $this->logError("Failed to send message to fd: $fd", ['error' => $e->getMessage()]);
                    $deadConnections[] = $fd;
                }
            } else {
                $deadConnections[] = $fd;
            }
        }

        if (!empty($deadConnections)) {
            $this->removeDeadConnections($deadConnections, $room);
        }
    }

    private function removeDeadConnections(array $deadConnections, string $room): void
    {
        foreach ($deadConnections as $fd) {
            $this->removeUserFromRoom($fd, $room);
        }

        $this->logInfo("Removed dead connections", [
            'room'        => $room,
            'count'       => count($deadConnections),
            'connections' => $deadConnections,
        ]);
    }

    private function cleanupInactiveConnections(): void
    {
        $currentTime = time();
        $inactiveConnections = [];

        foreach ($this->lastActivity as $fd => $lastTime) {
            if (($currentTime - $lastTime) > self::CONNECTION_TIMEOUT) {
                $inactiveConnections[] = $fd;
            }
        }

        foreach ($inactiveConnections as $fd) {
            if ($this->server->isEstablished($fd)) {
                $this->server->push($fd, json_encode([
                    'event_name' => 'timeout_warning',
                    'message'    => 'Connection will be closed due to inactivity',
                ]));

                $this->server->after(5000, function () use ($fd) {
                    if ($this->server->isEstablished($fd)) {
                        $this->server->disconnect($fd);
                    }
                });
            } else {
                $this->forceCleanupUser($fd);
            }
        }

        if (!empty($inactiveConnections)) {
            $this->logInfo("Cleaned up inactive connections", [
                'count'   => count($inactiveConnections),
                'timeout' => self::CONNECTION_TIMEOUT,
            ]);
        }
    }

    private function forceCleanupUser(int $fd): void
    {
        $this->removeUserFromAllRooms($fd);
        unset($this->lastActivity[$fd]);
    }

    private function logMemoryUsage(): void
    {
        $memoryUsage = memory_get_usage(true);
        $memoryPeak = memory_get_peak_usage(true);

        $this->logInfo("Memory usage", [
            'current_mb'        => round($memoryUsage / 1024 / 1024, 2),
            'peak_mb'           => round($memoryPeak / 1024 / 1024, 2),
            'total_connections' => $this->getConnectionsCount(),
            'total_rooms'       => count($this->rooms),
            'users_in_rooms'    => count($this->userRooms),
        ]);

        if ($memoryUsage > 400 * 1024 * 1024) { // 400MB
            $this->logWarning("High memory usage detected", [
                'current_mb' => round($memoryUsage / 1024 / 1024, 2),
            ]);
        }
    }

    public function onClose(Server $server, int $fd): void
    {
        $this->forceCleanupUser($fd);
        $this->logInfo("WebSocket connection closed", ['fd' => $fd]);
    }

    private function removeUserFromRoom(int $fd, string $room): void
    {
        if (isset($this->rooms[$room][$fd])) {
            unset($this->rooms[$room][$fd]);

            if (empty($this->rooms[$room])) {
                unset($this->rooms[$room]);
            }
        }

        if (isset($this->userRooms[$fd][$room])) {
            unset($this->userRooms[$fd][$room]);

            if (empty($this->userRooms[$fd])) {
                unset($this->userRooms[$fd]);
            }
        }

        $this->logInfo("User left room", [
            'fd'                => $fd,
            'room'              => $room,
            'remaining_in_room' => isset($this->rooms[$room]) ? count($this->rooms[$room]) : 0,
        ]);
    }

    private function removeUserFromAllRooms(int $fd): void
    {
        if (!isset($this->userRooms[$fd])) {
            return;
        }

        $userRooms = array_keys($this->userRooms[$fd]);

        foreach ($userRooms as $room) {
            if (isset($this->rooms[$room][$fd])) {
                unset($this->rooms[$room][$fd]);

                if (empty($this->rooms[$room])) {
                    unset($this->rooms[$room]);
                }
            }
        }

        unset($this->userRooms[$fd]);

        $this->logInfo("User removed from all rooms", [
            'fd'          => $fd,
            'rooms_count' => count($userRooms),
            'rooms'       => $userRooms,
        ]);
    }

    public function getUserRooms(int $fd): array
    {
        return array_keys($this->userRooms[$fd] ?? []);
    }

    public function getRoomUsers(string $room): array
    {
        return array_keys($this->rooms[$room] ?? []);
    }

    public function isUserInRoom(int $fd, string $room): bool
    {
        return isset($this->rooms[$room][$fd]);
    }

    public function start(): void
    {
        if (!isset($this->server)) {
            throw new \RuntimeException('OpenSwoole server not created. Call createServer() first.');
        }

        $this->logInfo("Starting websocket server", []);

        $this->server->start();
    }

    public function getServer(): ?Server
    {
        return $this->server ?? null;
    }

    public function getConnectionsCount(): int
    {
        return count($this->server->connections ?? []);
    }

    public function logStats(): void
    {
        $this->logWarning("Stats", [
            'total_connections' => $this->getConnectionsCount(),
            'total_rooms'       => count($this->rooms),
            'users_in_rooms'    => count($this->userRooms),
            'rooms_list'        => array_keys($this->rooms),
        ]);
    }

    private function consoleLog(string $message, array $context = [], string $level = 'INFO'): void
    {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' | Context: '.json_encode($context, JSON_UNESCAPED_UNICODE) : '';

        $logMessage = "[{$timestamp}] [{$level}] OpenSwoole WebSocket: {$message}{$contextStr}\n";

        if ($level === 'ERROR') {
            fwrite(STDERR, $logMessage);
        } else {
            fwrite(STDOUT, $logMessage);
        }

        match ($level) {
            'ERROR' => Log::error($message, $context),
            'WARNING' => Log::warning($message, $context),
            'DEBUG' => Log::debug($message, $context),
            default => Log::info($message, $context)
        };
    }

    private function logInfo(string $message, array $context = []): void
    {
        $this->consoleLog($message, $context, 'INFO');
    }

    private function logError(string $message, array $context = []): void
    {
        $this->consoleLog($message, $context, 'ERROR');
    }

    private function logWarning(string $message, array $context = []): void
    {
        $this->consoleLog($message, $context, 'WARNING');
    }

    private function logDebug(string $message, array $context = []): void
    {
        $this->consoleLog($message, $context, 'DEBUG');
    }

    private function handlePing(int $fd): void
    {
        $this->server->push($fd, json_encode([
            'event_name' => 'pong',
            'timestamp'  => time(),
        ]));
    }

    private function handleLeaveRoom(int $fd, array $data): void
    {
        if (!isset($data['room'])) {
            $this->logWarning("Room name not provided in leave_room event", ['fd' => $fd]);

            return;
        }

        $room = $data['room'];
        $this->removeUserFromRoom($fd, $room);

        $this->server->push($fd, json_encode([
            'event_name' => 'room_left',
            'room'       => $room,
            'timestamp'  => time(),
        ]));
    }
}
