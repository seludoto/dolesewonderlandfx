# Fresh Start Deployment Guide

## ✅ Cleanup Complete

All droplets have been deleted except for:
- **doleseenterprises** (523031329)
- IP: `134.209.15.243`
- Size: 2GB RAM, 2 vCPUs, 50GB disk
- Region: San Francisco (sfo2)

The Kubernetes cluster has been completely removed, freeing up resources and reducing costs.

## Current Monthly Cost

**Before**: $66/month (K8s cluster + small droplet)
**Now**: $18/month (single 2GB droplet)
**Savings**: $48/month (73% cost reduction) 💰

## Deployment Overview

We'll deploy the entire backend to the single droplet at `134.209.15.243`. The all-in-one setup includes:

- ✅ Backend API (Node.js + Express)
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Nginx reverse proxy

## Resource Usage (2GB Droplet)

| Service | Memory | Notes |
|---------|--------|-------|
| PostgreSQL | ~200MB | Database |
| Redis | ~50MB | Cache |
| Backend API | ~300-500MB | Node.js app |
| Nginx | ~10MB | Reverse proxy |
| System | ~200MB | Ubuntu OS |
| **Total** | **~760-960MB** | **~1GB free** |

⚠️ **Note**: This is tight for a 2GB droplet. If you experience performance issues, consider upgrading to 4GB ($24/month).

## Step-by-Step Deployment

### Option 1: Automated Deployment (Recommended)

If you can SSH into the droplet, use the automated script:

```powershell
# From your Windows machine
cd "d:\Trading Materials\DOLESE BOOKS\dolesefx\dolesewonderlandfx"
.\deploy-backend-to-droplet.ps1
```

This script will:
1. Test droplet connectivity
2. Copy deployment script to droplet
3. Execute automated deployment
4. Verify services are running

### Option 2: Manual Deployment via Digital Ocean Console

Since SSH port 22 is currently not accessible, you'll need to use the Digital Ocean console:

#### 1. Access the Droplet Console

1. Go to: https://cloud.digitalocean.com/droplets/523031329
2. Click **"Access"** → **"Launch Droplet Console"**
3. Login with your credentials (you may need to reset the password first)

#### 2. Enable SSH Access

```bash
# In the droplet console, run:
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp
ufw enable
systemctl restart ssh
```

#### 3. Run the Deployment Script

Copy and paste this entire block into the console:

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install -y docker-compose-plugin git ufw certbot

# Configure firewall (if not done above)
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp

# Clone repository
mkdir -p /opt/dolesewonderlandfx
cd /opt/dolesewonderlandfx
git clone https://github.com/seludoto/dolesewonderlandfx.git .

# Setup backend
cd /opt/dolesewonderlandfx/backend
cp .env.production.example .env

# ⚠️ IMPORTANT: Configure your .env file
nano .env
```

#### 4. Configure Environment Variables

Edit the `.env` file with your settings:

```bash
# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=dolesewonderlandfx
DATABASE_USER=dolesefx
DATABASE_PASSWORD=your_secure_password_here  # ⚠️ CHANGE THIS!

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_here  # ⚠️ CHANGE THIS!
JWT_EXPIRES_IN=7d

# API Configuration
PORT=5000
NODE_ENV=production
API_URL=https://api.dolesewonderlandfx.me

# Frontend URL
FRONTEND_URL=https://dolesewonderlandfx.me

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=noreply@dolesewonderlandfx.me

# Other settings...
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

#### 5. Deploy the Backend

```bash
# Start all services
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml up -d

# Wait for services to start
sleep 15

# Check status
docker compose -f docker-compose.all-in-one.yml ps

# Check logs
docker compose -f docker-compose.all-in-one.yml logs backend
```

#### 6. Verify Deployment

```bash
# Test backend health
curl http://localhost:5000/health

# Should return: {"status":"ok","timestamp":"..."}
```

From your local machine:
```powershell
# Test from outside
curl http://134.209.15.243:5000/health
```

## Post-Deployment Steps

### 1. Configure DNS

Add these DNS records in your domain provider (Cloudflare, Namecheap, etc.):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | 134.209.15.243 | 3600 |

Wait 5-10 minutes for DNS propagation, then test:
```powershell
nslookup api.dolesewonderlandfx.me
```

### 2. Setup SSL Certificates

Once DNS is configured, SSH into the droplet and run:

```bash
# Stop Nginx temporarily
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml stop nginx

# Get SSL certificate
certbot certonly --standalone -d api.dolesewonderlandfx.me

# Update Nginx configuration to use SSL
# (nginx.conf already configured for SSL)

# Copy certificates to nginx directory
mkdir -p /opt/dolesewonderlandfx/backend/ssl
cp /etc/letsencrypt/live/api.dolesewonderlandfx.me/fullchain.pem /opt/dolesewonderlandfx/backend/ssl/
cp /etc/letsencrypt/live/api.dolesewonderlandfx.me/privkey.pem /opt/dolesewonderlandfx/backend/ssl/

# Restart services
docker compose -f docker-compose.all-in-one.yml up -d
```

### 3. Test Production API

```powershell
# HTTP (will redirect to HTTPS)
curl http://api.dolesewonderlandfx.me/health

# HTTPS
curl https://api.dolesewonderlandfx.me/health
```

## Monitoring & Maintenance

### View Logs

```bash
# All services
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml logs -f

# Specific service
docker compose -f docker-compose.all-in-one.yml logs -f backend
docker compose -f docker-compose.all-in-one.yml logs -f postgres
docker compose -f docker-compose.all-in-one.yml logs -f redis
```

### Check Resource Usage

```bash
# Container stats
docker stats

# System resources
htop  # or: top
df -h  # disk usage
free -h  # memory usage
```

### Restart Services

```bash
cd /opt/dolesewonderlandfx/backend

# Restart all
docker compose -f docker-compose.all-in-one.yml restart

# Restart specific service
docker compose -f docker-compose.all-in-one.yml restart backend
```

### Update Code

```bash
cd /opt/dolesewonderlandfx
git pull origin main
cd backend
docker compose -f docker-compose.all-in-one.yml down
docker compose -f docker-compose.all-in-one.yml up -d --build
```

### Backup Database

```bash
# Create backup
docker exec backend-postgres-1 pg_dump -U dolesefx dolesewonderlandfx > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20250104.sql | docker exec -i backend-postgres-1 psql -U dolesefx dolesewonderlandfx
```

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker compose -f docker-compose.all-in-one.yml logs backend

# Common issues:
# 1. Database not ready - wait 30 seconds and restart
# 2. Port conflicts - ensure no other services on port 5000
# 3. Memory issues - upgrade to 4GB droplet
```

### Cannot Connect to API

```bash
# Check firewall
ufw status

# Check if services are running
docker compose -f docker-compose.all-in-one.yml ps

# Check nginx logs
docker compose -f docker-compose.all-in-one.yml logs nginx
```

### Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Solutions:
# 1. Upgrade to 4GB droplet ($24/month)
# 2. Optimize services (reduce PostgreSQL shared_buffers)
# 3. Add swap space (not recommended for production)
```

## Upgrade Recommendations

If you experience performance issues:

1. **4GB Droplet** ($24/month) - Recommended minimum
   - Comfortable memory headroom
   - Can handle more concurrent users
   - Room for future services

2. **8GB Droplet** ($48/month) - Production ready
   - Can add forum service
   - Handle 1000+ concurrent users
   - Room for monitoring tools

To upgrade:
1. Go to: https://cloud.digitalocean.com/droplets/523031329
2. Click **"Resize"**
3. Select new size
4. Click **"Resize Droplet"**
5. Reboot droplet

## Cost Summary

| Configuration | Monthly Cost | Savings |
|---------------|--------------|---------|
| Previous (K8s + droplet) | $66 | - |
| Current (2GB droplet) | $18 | $48 (73%) |
| With 4GB droplet | $24 | $42 (64%) |
| With 8GB droplet | $48 | $18 (27%) |

## Next Steps

1. ✅ Cleanup complete (K8s cluster deleted)
2. ⏳ Deploy backend to 134.209.15.243
3. ⏳ Configure DNS
4. ⏳ Setup SSL
5. ⏳ Test production API
6. ⏳ Monitor performance
7. ⏳ Consider upgrading to 4GB if needed

## Support

- **Digital Ocean Console**: https://cloud.digitalocean.com/droplets/523031329
- **Documentation**: See `COST_OPTIMIZED_DEPLOYMENT.md`
- **Backend Guide**: See `backend/ALL_IN_ONE_DEPLOYMENT.md`
- **API Docs**: See `backend/docs/API_DOCUMENTATION.md`

## Quick Commands Reference

```bash
# SSH into droplet (once enabled)
ssh root@134.209.15.243

# View all containers
docker ps

# View logs
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml logs -f

# Restart services
docker compose -f docker-compose.all-in-one.yml restart

# Stop services
docker compose -f docker-compose.all-in-one.yml down

# Start services
docker compose -f docker-compose.all-in-one.yml up -d

# Update code
git pull origin main
docker compose -f docker-compose.all-in-one.yml up -d --build

# Check health
curl http://localhost:5000/health
```

---

**Ready to deploy!** 🚀

Follow the steps above to get your backend running on the cleaned-up droplet.
