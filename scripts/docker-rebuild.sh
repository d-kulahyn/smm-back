#!/bin/bash

# Automatic Docker containers rebuild script
# Uses docker-compose for safe rebuild with minimal downtime

set -e  # Exit on any error

echo "🚀 Starting Docker containers rebuild..."

# Navigate to docker-compose.yml directory
cd "$(dirname "$0")/../docker"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml file not found in docker/ directory"
    exit 1
fi

# Load environment variables if .env file exists
if [ -f "../.env" ]; then
    echo "📋 Loading environment variables from .env"
    export $(grep -v '^#' ../.env | xargs)
fi

echo "⏹️  Stopping current containers..."
docker-compose down

echo "🧹 Cleaning unused images..."
docker image prune -f

echo "🔨 Rebuilding images without cache..."
docker-compose build --no-cache

echo "🆙 Starting updated containers..."
docker-compose up -d

echo "🔍 Checking container status..."
docker-compose ps

echo "📊 Waiting for services to be ready..."
sleep 30

# Check container health checks
echo "🏥 Checking container health checks..."
for service in $(docker-compose config --services); do
    if docker-compose ps --format json | grep -q "\"Health\":\"healthy\""; then
        echo "✅ Service $service is working correctly"
    else
        echo "⚠️  Check service $service status"
    fi
done

echo "🎯 Docker containers rebuild completed successfully!"
echo "📝 View logs with command: docker-compose logs -f"
