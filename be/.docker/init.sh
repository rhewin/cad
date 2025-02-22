#!/bin/sh

echo "Waiting for Redis to be available..."
until redis-cli -h redis -p 6379 -a "$REDIS_PASSWORD" ping | grep -q "PONG"; do
  sleep 5
done
echo "✅ Redis is ready! Starting API..."

echo "🚀 Running database migrations and Prisma setup..."
bunx prisma generate
bunx prisma migrate deploy
bunx prisma db seed

echo "Starting API Service..."
exec bun run src/index.ts  # Use `exec` to replace the shell process with Bun
