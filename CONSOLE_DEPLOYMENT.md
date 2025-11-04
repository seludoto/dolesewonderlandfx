# Deployment Instructions - Digital Ocean Console

## Summary
✅ **Kubernetes cluster deleted** - All worker nodes removed
✅ **Repository cloned** - Code is at `/opt/dolesewonderlandfx`
✅ **Docker installed** - Version 28.5.1
✅ **Ready to deploy** - Just need to run the deployment script

## Quick Deploy Steps

Since SSH keeps disconnecting, use the **Digital Ocean Console** instead:

### Step 1: Access the Droplet Console

1. Go to: https://cloud.digitalocean.com/droplets/523031329
2. Click **"Access"** tab
3. Click **"Launch Droplet Console"**
4. Login (you may need to reset password first if you don't have it)

### Step 2: Run the Deployment Script

The repository is already cloned at `/opt/dolesewonderlandfx`. Just run:

```bash
cd /opt/dolesewonderlandfx
git pull origin main
bash deploy-console.sh
```

**OR** if you prefer to run commands step by step:

```bash
# Navigate to backend
cd /opt/dolesewonderlandfx/backend

# Create environment file
cp .env.production.example .env

# Set passwords (use strong passwords in production!)
sed -i 's/your_secure_postgres_password_here/DoleSeFx_Postgres_2024_Secure!/g' .env
sed -i 's/your_secure_redis_password_here/DoleSeFx_Redis_2024_Secure!/g' .env
sed -i 's/your_jwt_secret_minimum_32_characters_long/DoleSeFx_JWT_Secret_2024_Production_Key_Very_Secure_123456/g' .env
sed -i 's/your_refresh_secret_minimum_32_characters_long/DoleSeFx_Refresh_Secret_2024_Production_Key_Very_Secure_123456/g' .env

# Start services
docker compose -f docker-compose.all-in-one.yml up -d

# Wait 30 seconds for services to start
sleep 30

# Check status
docker compose -f docker-compose.all-in-one.yml ps

# Test health
curl http://localhost:5000/health
```

### Step 3: Verify Deployment

After the script completes, test from your local machine:

```powershell
# Test health endpoint
curl http://134.209.15.243:5000/health

# Or in browser, visit:
# http://134.209.15.243:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T..."
}
```

## What Gets Deployed

The `docker-compose.all-in-one.yml` file will start:

1. **PostgreSQL** - Database (port 5432)
2. **Redis** - Cache (port 6379)
3. **Backend API** - Node.js app (port 5000)
4. **Nginx** - Reverse proxy (ports 80/443)

## Resource Usage (2GB Droplet)

Expected memory usage:
- PostgreSQL: ~200MB
- Redis: ~50MB
- Backend: ~300-500MB
- Nginx: ~10MB
- System: ~200MB
- **Total: ~760-960MB** (leaves ~1GB free)

⚠️ **Note**: 2GB is tight. If you experience OOM errors, upgrade to 4GB droplet ($24/month).

## Monitoring

### View Logs
```bash
cd /opt/dolesewonderlandfx/backend

# All services
docker compose -f docker-compose.all-in-one.yml logs -f

# Backend only
docker compose -f docker-compose.all-in-one.yml logs -f backend

# Last 100 lines
docker compose -f docker-compose.all-in-one.yml logs --tail=100
```

### Check Status
```bash
# Service status
docker compose -f docker-compose.all-in-one.yml ps

# Resource usage
docker stats

# System resources
free -h   # Memory
df -h     # Disk
```

### Restart Services
```bash
cd /opt/dolesewonderlandfx/backend

# Restart all
docker compose -f docker-compose.all-in-one.yml restart

# Restart specific service
docker compose -f docker-compose.all-in-one.yml restart backend
```

## Next Steps After Deployment

### 1. Configure DNS
Add these A records to your DNS provider:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | 134.209.15.243 | 3600 |

Wait 5-10 minutes, then test:
```powershell
nslookup api.dolesewonderlandfx.me
```

### 2. Setup SSL Certificate

Once DNS is configured:

```bash
# Stop Nginx temporarily
docker compose -f docker-compose.all-in-one.yml stop nginx

# Get SSL certificate
apt-get install -y certbot
certbot certonly --standalone -d api.dolesewonderlandfx.me

# Certificates will be at:
# /etc/letsencrypt/live/api.dolesewonderlandfx.me/fullchain.pem
# /etc/letsencrypt/live/api.dolesewonderlandfx.me/privkey.pem

# Restart Nginx
docker compose -f docker-compose.all-in-one.yml start nginx
```

### 3. Update Production Secrets

Edit the `.env` file with proper production values:

```bash
cd /opt/dolesewonderlandfx/backend
nano .env

# Update:
# - DB_PASSWORD (use strong password)
# - REDIS_PASSWORD (use strong password)
# - JWT_SECRET (64+ random characters)
# - JWT_REFRESH_SECRET (64+ random characters)
# - SENDGRID_API_KEY (if using email)
# - AWS credentials (if using S3)

# Restart services after changes
docker compose -f docker-compose.all-in-one.yml restart
```

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker compose -f docker-compose.all-in-one.yml logs backend

# Common issues:
# 1. Database not ready - wait 30 seconds and restart
# 2. Port conflicts - check if port 5000 is in use: netstat -tulpn | grep 5000
# 3. Memory issues - check: free -h
```

### Cannot Connect to API

```bash
# Check if services are running
docker compose -f docker-compose.all-in-one.yml ps

# Check firewall
ufw status

# Should show:
# 22/tcp - ALLOW
# 80/tcp - ALLOW
# 443/tcp - ALLOW
# 5000/tcp - ALLOW

# If not, enable:
ufw allow 5000/tcp
```

### Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Solutions:
# 1. Upgrade to 4GB droplet ($24/month)
# 2. Reduce PostgreSQL shared_buffers
# 3. Optimize Node.js heap size
```

## Useful Commands

```bash
# Update code
cd /opt/dolesewonderlandfx
git pull origin main
cd backend
docker compose -f docker-compose.all-in-one.yml up -d --build

# Backup database
docker exec backend-postgres-1 pg_dump -U postgres dolesewonderlandfx > backup.sql

# Restore database
cat backup.sql | docker exec -i backend-postgres-1 psql -U postgres dolesewonderlandfx

# View environment variables
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml config

# Remove all containers and volumes (DANGER!)
docker compose -f docker-compose.all-in-one.yml down -v
```

## Cost Savings

**Before**: $66/month (Kubernetes cluster)
**Now**: $18/month (Single 2GB droplet)
**Savings**: $48/month (73% reduction) 💰

## Support

If you encounter issues:

1. **Check logs**: `docker compose logs -f`
2. **Check health**: `curl http://localhost:5000/health`
3. **Check resources**: `docker stats`
4. **Documentation**: See `FRESH_START_DEPLOYMENT.md`

---

**Ready to deploy! 🚀**

Just access the console and run the commands above.
