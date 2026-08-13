#!/usr/bin/env bash
set -e

echo "=========================================="
echo " TechWebCode Cloud VM Automated Deployment"
echo "=========================================="

# 1. Ensure .env exists
if [ ! -f .env ]; then
    echo "Creating .env from template..."
    cp .env.example .env 2>/dev/null || cat << 'EOF' > .env
APP_ENV=production
MYSQL_DATABASE=techwebcode
MYSQL_USER=techwebcode
MYSQL_PASSWORD=change_this_secure_password
MYSQL_ROOT_PASSWORD=change_this_root_password
ADMIN_SECRET=change_this_admin_secret_token
NEXT_PUBLIC_API_URL=/api/v1
DOMAIN=techwebcode.in
EOF
    echo "PLEASE UPDATE .env WITH YOUR SECURE PASSWORDS AND DOMAIN!"
fi

# 2. Pull latest code (if in git repo)
if [ -d .git ]; then
    echo "Pulling latest git changes..."
    git pull origin main || true
fi

# 3. Build & launch Docker containers
echo "Starting production Docker containers..."
docker compose -f docker-compose.yml up -d --build --remove-orphans

# 4. Restart backend after MySQL health check
echo "Waiting for MySQL database readiness..."
sleep 5
docker compose restart backend

echo "=========================================="
echo " Deployment Complete!"
echo " Web Frontend: http://localhost (Port 80)"
echo " API Status:   http://localhost/api/v1/health"
echo "=========================================="
