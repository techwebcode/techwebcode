# TechWebCode CI/CD & Docker Hub Deployment Guide

This guide explains how to set up **GitHub Actions CI/CD** to automatically build and push Docker images to **Docker Hub**, and how to pull and run the application anywhere with a single command.

---

## 1. GitHub Secrets Setup

Navigate to your GitHub Repository:
`Settings -> Secrets and variables -> Actions -> New repository secret`

Add the following secrets:

| Secret Name | Description | Example Value |
|---|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub Username | `rajatsingh` |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token | `dckr_pat_xxx...` |
| `NEXT_PUBLIC_API_URL` | Production Public API URL | `https://techwebcode.com/api/v1` |

---

## 2. Docker Hub Repositories

Create 3 public (or private) repositories on [Docker Hub](https://hub.docker.com/):
- `<username>/techwebcode-backend`
- `<username>/techwebcode-frontend`
- `<username>/techwebcode-admin`

---

## 3. How CI/CD Works

1. On every `git push origin main`, GitHub Actions automatically:
   - Compiles Go Backend (`techwebcode-backend`)
   - Builds Next.js Web Frontend (`techwebcode-frontend`)
   - Builds Next.js Admin Dashboard (`techwebcode-admin`)
2. Tags images with `latest` and Git commit SHA.
3. Pushes images directly to Docker Hub.

---

## 4. Run Anywhere (1-Command Server Deployment)

To pull and run TechWebCode on **any server or local machine** without compiling source code:

### Option A: Using the `deploy.sh` script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Using Docker Compose directly
```bash
# 1. Download compose file and env template
cp .env.example .env

# 2. Pull pre-built images from Docker Hub and start
DOCKER_USERNAME=yourusername docker compose -f docker-compose.prod.yml up -d
```

### Accessing Services:
- **Web Frontend**: `http://your-server-ip/`
- **Go Backend API**: `http://your-server-ip/api/v1/tools`
- **Admin Dashboard**: `http://your-server-ip/admin`
