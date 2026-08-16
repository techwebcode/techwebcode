# Ubuntu Host Nginx Reverse Proxy Setup Guide

Nginx is managed separately on the Ubuntu host machine and acts as the reverse proxy for SSL termination and request routing. Docker contains only the core application services (`frontend`, `admin`, `backend`, `mysql`).

---

## Production Architecture Diagram

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

---

## 1. Nginx Host Configuration File

Place the following configuration in `/etc/nginx/sites-available/techwebcode.conf` on your Ubuntu host server:

```nginx
# Web Frontend (techwebcode.in)
server {
    listen 80;
    server_name techwebcode.in www.techwebcode.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/v1/ {
        proxy_pass http://127.0.0.1:8082/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }

    location /media/ {
        proxy_pass http://127.0.0.1:8082/media/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}

# Admin Dashboard (admin.techwebcode.in)
server {
    listen 80;
    server_name admin.techwebcode.in;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/v1/ {
        proxy_pass http://127.0.0.1:8082/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

---

## 2. Enable & Test Nginx

```bash
# Enable site configuration
sudo ln -sf /etc/nginx/sites-available/techwebcode.conf /etc/nginx/sites-enabled/

# Test syntax & reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 3. SSL Certificate Setup (Certbot / Let's Encrypt)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d techwebcode.in -d www.techwebcode.in -d admin.techwebcode.in
```
