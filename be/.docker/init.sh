#!/bin/sh

echo "Waiting for Redis to be available..."
until redis-cli -h redis -p 6379 -a "$REDIS_PASSWORD" ping | grep -q "PONG"; do
  sleep 5
done
echo "✅ Redis is ready! Starting API..."

echo "🚀 Running database migrations and Prisma setup..."
if ! bunx prisma generate; then
  echo "❌ Failed to generate Prisma client"
  exit 1
fi

if ! bunx prisma migrate deploy; then
  echo "❌ Failed to apply migrations"
  exit 1
fi

if ! bunx prisma db seed; then
  echo "❌ Failed to seed the database"
  exit 1
fi
echo "✅ Prisma setup complete!"

echo "Starting API Service..."
bun run src/index.ts  # Use `exec` to replace the shell process with Bun
