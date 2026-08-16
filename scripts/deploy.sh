#!/usr/bin/env bash
set -e

echo "=========================================="
echo " TechWebCode Production Container Deployer"
echo "=========================================="

# 1. Ensure .env file exists from template if missing
if [ ! -f .env ]; then
    echo "Creating .env from template..."
    cp .env.example .env
    echo "PLEASE UPDATE .env WITH YOUR PRODUCTION PASSWORDS & SECRETS!"
fi

# 2. Build & launch Docker containers (Frontend, Admin, Backend, MySQL)
echo "Starting application containers..."
docker compose up -d --build --remove-orphans

# 3. Wait for MySQL database health check
echo "Waiting for database readiness..."
sleep 3

echo "=========================================="
echo " Application Containers Ready!"
echo " Frontend (Web):   http://127.0.0.1:3000"
echo " Admin Dashboard: http://127.0.0.1:3001"
echo " Go Backend API:  http://127.0.0.1:8082"
echo "=========================================="
