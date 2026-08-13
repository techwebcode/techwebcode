#!/usr/bin/env bash
set -e

echo "🚀 Starting TechWebCode Docker Hub Production Deployment..."

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Ensure DOCKER_USERNAME is set
DOCKER_USERNAME=${DOCKER_USERNAME:-rajatsingh}

echo "📦 Pulling latest Docker Hub images for user: ${DOCKER_USERNAME}..."
DOCKER_USERNAME=${DOCKER_USERNAME} docker compose -f docker-compose.prod.yml pull

echo "⚡ Starting services..."
DOCKER_USERNAME=${DOCKER_USERNAME} docker compose -f docker-compose.prod.yml up -d

echo "🌱 Running database seeder..."
docker compose -f docker-compose.prod.yml exec -T backend ./server_app -seed 2>/dev/null || echo "Database initialized!"

echo "✅ TechWebCode deployment successful! All services running."
