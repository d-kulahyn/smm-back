#!/bin/bash

echo "🔧 Fixing PostgreSQL collation issue..."

# Wait for PostgreSQL readiness
timeout=60
while [ $timeout -gt 0 ]; do
    if pg_isready -h split_trip_db_pg -p 5432 -U web >/dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    echo "⏳ Waiting for PostgreSQL... ($timeout sec)"
    sleep 2
    timeout=$((timeout-2))
done

if [ $timeout -le 0 ]; then
    echo "❌ PostgreSQL is unavailable"
    exit 1
fi

# Fix collation
echo "🔄 Updating collation version..."
PGPASSWORD=webdb psql -h split_trip_db_pg -p 5432 -U web -d split_trip -c "ALTER DATABASE split_trip REFRESH COLLATION VERSION;" 2>/dev/null || echo "⚠️ Collation already updated or unavailable"

echo "✅ Collation issue fixed"
