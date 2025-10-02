#!/bin/bash
set -e

echo "🚀 Starting Laravel Octane with Swoole (up to 10,000+ RPS)..."

# Change to the correct working directory
cd /var/www/html

# Wait for project volume mounting
timeout=30
while [ $timeout -gt 0 ] && [ ! -f "/var/www/html/artisan" ]; do
    echo "⏳ Waiting for project mounting... ($timeout sec)"
    sleep 2
    timeout=$((timeout-2))
done

if [ ! -f "/var/www/html/artisan" ]; then
    echo "❌ Laravel project not found in /var/www/html"
    exit 1
fi

echo "✅ Laravel project found"

# Create necessary directories
mkdir -p /var/www/html/storage/{app,framework/{cache,sessions,views},logs}
mkdir -p /var/www/html/bootstrap/cache

# Set correct permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Install dependencies if needed
if [ ! -d "/var/www/html/vendor" ]; then
    echo "📦 Installing dependencies..."
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Check for Octane presence
if ! composer show laravel/octane >/dev/null 2>&1; then
    echo "📦 Installing Laravel Octane..."
    composer require laravel/octane --no-interaction
    php artisan octane:install --server=swoole --no-interaction
fi

# Check .env file
if [ ! -f "/var/www/html/.env" ]; then
    echo "📄 Copying .env.example to .env..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Generate application key if needed
if ! grep -q "APP_KEY=" /var/www/html/.env || [ -z "$(grep APP_KEY /var/www/html/.env | cut -d'=' -f2)" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --no-interaction
fi

# Cache Laravel configuration
echo "⚡ Optimizing Laravel for Swoole..."
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache
php artisan event:clear
php artisan event:cache

# Create symbolic link for storage
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "🔗 Creating symbolic link for storage..."
    php artisan storage:link
fi

# Check database availability
echo "🗄️ Checking database connection..."
timeout=60
while [ $timeout -gt 0 ]; do
    if php artisan migrate:status >/dev/null 2>&1; then
        echo "✅ Database is available"

        # Fix PostgreSQL collation issue
        echo "🔧 Fixing PostgreSQL collation..."
        PGPASSWORD=webdb psql -h split_trip_db_pg -p 5432 -U web -d split_trip -c "ALTER DATABASE split_trip REFRESH COLLATION VERSION;" 2>/dev/null || echo "⚠️ Collation already updated"

        echo "🔄 Running migrations..."
        php artisan migrate --force --no-interaction
        break
    fi
    echo "⏳ Waiting for database... ($timeout sec)"
    sleep 3
    timeout=$((timeout-3))
done

# Set environment variables for Swoole
export OCTANE_SERVER=swoole
export OCTANE_WORKERS=auto
export OCTANE_TASK_WORKERS=auto
export OCTANE_MAX_REQUESTS=1000

echo "🔥 Starting Laravel Octane with Swoole..."
echo "🌐 Server will be available on port 8080"
echo "📊 HTTP Workers: auto, Task Workers: auto"
echo "⚡ Max requests per worker: 1000"
echo "🚀 Expected performance: up to 10,000+ RPS"

# Start Swoole with optimal settings
php artisan octane:start \
    --server=swoole \
    --host=0.0.0.0 \
    --port=8080 \
    --workers=auto \
    --task-workers=auto \
    --max-requests=1000 \
    --watch &

# Start WebSocket server via Artisan command
#echo "🌐 Starting WebSocket server on port 8082..."
#php artisan websocket:serve --host=0.0.0.0 --port=8082 &

# Wait for processes to complete
wait
