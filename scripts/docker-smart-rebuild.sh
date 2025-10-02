#!/bin/bash

# Smart Docker rebuild - rebuilds only services with changes
# Analyzes which Dockerfiles changed and rebuilds only necessary containers

set -e

echo "🧠 Starting smart Docker rebuild..."

# Navigate to project root directory
cd "$(git rev-parse --show-toplevel)"

# Get list of changed files from last commit
CHANGED_FILES=$(git diff --name-only HEAD@{1} HEAD 2>/dev/null || git diff --name-only HEAD~1 HEAD)

if [ -z "$CHANGED_FILES" ]; then
    echo "ℹ️  No changes to analyze. Running full rebuild..."
    ./scripts/docker-rebuild.sh
    exit 0
fi

echo "📁 Changed files:"
echo "$CHANGED_FILES"

# Determine which services need to be rebuilt
SERVICES_TO_REBUILD=""

# Check changes in main Docker files
if echo "$CHANGED_FILES" | grep -q "docker/docker-compose.yml"; then
    echo "🔄 docker-compose.yml changed - rebuilding all services"
    SERVICES_TO_REBUILD="all"
elif echo "$CHANGED_FILES" | grep -q "docker/web/"; then
    echo "🌐 Detected changes in web service"
    SERVICES_TO_REBUILD="$SERVICES_TO_REBUILD split_trip_web"
elif echo "$CHANGED_FILES" | grep -q "docker/swoole/"; then
    echo "🚀 Detected changes in swoole service"
    SERVICES_TO_REBUILD="$SERVICES_TO_REBUILD split_trip_swoole"
elif echo "$CHANGED_FILES" | grep -q "docker/node/\|socket-server/"; then
    echo "📡 Detected changes in node service"
    SERVICES_TO_REBUILD="$SERVICES_TO_REBUILD split_trip_node"
elif echo "$CHANGED_FILES" | grep -q "docker/pg/"; then
    echo "🗄️  Detected changes in PostgreSQL service"
    SERVICES_TO_REBUILD="$SERVICES_TO_REBUILD split_trip_db_pg"
fi

# Check changes in application code
if echo "$CHANGED_FILES" | grep -q "project/\|front/"; then
    echo "💻 Detected changes in application code"
    SERVICES_TO_REBUILD="$SERVICES_TO_REBUILD split_trip_swoole split_trip_web"
fi

cd docker

if [ "$SERVICES_TO_REBUILD" = "all" ]; then
    echo "🔄 Running full rebuild of all services..."
    ../scripts/docker-rebuild.sh
else
    if [ -n "$SERVICES_TO_REBUILD" ]; then
        echo "🎯 Rebuilding services: $SERVICES_TO_REBUILD"

        # Stop only needed services
        for service in $SERVICES_TO_REBUILD; do
            echo "⏹️  Stopping $service..."
            docker-compose stop $service 2>/dev/null || true
        done

        # Rebuild only needed services
        for service in $SERVICES_TO_REBUILD; do
            echo "🔨 Rebuilding $service..."
            docker-compose build --no-cache $service
        done

        # Start rebuilt services
        echo "🆙 Starting updated services..."
        docker-compose up -d $SERVICES_TO_REBUILD

        echo "✅ Smart rebuild completed successfully!"
    else
        echo "ℹ️  No changes in Docker configuration detected. Rebuild not required."
    fi
fi
