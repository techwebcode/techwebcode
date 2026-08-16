# TechWebCode — Monorepo Architecture

TechWebCode is a modern web platform built with Next.js (App Router), Go (Gin framework), MySQL, and Docker.

---

## Directory Structure

```text
techwebcode/
├── backend/                  # Go Gin REST API service
├── frontend/                 # Next.js Web Application
├── admin/                    # Next.js Admin Dashboard Application
├── docker/                   # Docker build definitions
│   ├── backend/
│   │   └── Dockerfile        # Go backend Dockerfile
│   ├── frontend/
│   │   └── Dockerfile        # Next.js web application Dockerfile
│   ├── admin/
│   │   └── Dockerfile        # Next.js admin dashboard Dockerfile
│   └── mysql/
│       └── my.cnf            # MySQL custom configuration
├── scripts/                  # Operational & deployment scripts
│   └── deploy.sh             # Automated container launcher
├── docs/                     # Documentation & setup guides
│   ├── DEPLOYMENT.md         # CI/CD and production deployment guide
│   └── NGINX_HOST_SETUP.md   # Host-level Nginx reverse proxy configuration
├── .env.example              # Environment template
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

---

## Production Architecture

```text
                  Internet
                      │
           HTTP (80) / HTTPS (443)
                      ▼
            Ubuntu Host Nginx
         ┌────────────┴────────────┐
         ▼                         ▼
   techwebcode.in        admin.techwebcode.in
   (Frontend)                  (Admin)
    │     │                       │
    │     └──────► /api/v1 ◄──────┘
    │                 │
    ▼                 ▼
Port 3000          Port 8082 (Go Backend)
                      │
                      ▼
                   Port 3306 (MySQL)
```

Nginx runs strictly on the host OS as a reverse proxy for SSL termination and domain routing. Docker manages only application containers (`frontend`, `admin`, `backend`, `mysql`).

---

## Quick Start (Local Development)

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Start Application Stack via Docker Compose
```bash
docker compose up -d --build
```

### Services Available Locally:
- **Web Frontend**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`
- **Go Backend API**: `http://localhost:8082/api/v1`
- **MySQL Database**: `localhost:3600` (User: `techwebcode`, Pass: `root@123`)

---

## Environment Variables

| Variable | Description | Default | Safe for Client (`NEXT_PUBLIC_`) |
|---|---|---|---|
| `MYSQL_DATABASE` | Database name | `techwebcode` | ❌ No |
| `MYSQL_USER` | Database user | `techwebcode` | ❌ No |
| `MYSQL_PASSWORD` | Database password | `root@123` | ❌ No |
| `ADMIN_SECRET` | Backend admin authentication token | `xL6Lwfl5GgKVBMl1ehHiZ1` | ❌ No |
| `NEXT_PUBLIC_API_URL` | Public API endpoint for browser calls | `http://localhost:8082/api/v1` | ✅ Yes |
| `INTERNAL_API_URL` | Internal Docker container-to-container API endpoint for SSR | `http://backend:8080/api/v1` | ❌ No |
| `UPLOAD_PATH` | Persistent media upload path | `/var/www/techwebcode-media` | ❌ No |
