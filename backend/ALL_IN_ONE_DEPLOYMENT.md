# All-in-One Backend Deployment

Deploy all backend services (API, Database, Cache, Proxy) in a single Docker Compose setup to minimize costs.

## Cost Savings

### Before (Microservices on Kubernetes):
- **3-4 Node Cluster**: $72-96/month
- **Load Balancer**: $12/month
- **Container Registry**: $7/month
- **Database (Managed)**: $15/month
- **Redis (Managed)**: $15/month
- **Total**: **~$121-145/month**

### After (All-in-One on Single Droplet):
- **8GB Droplet**: $48/month
- **Container Registry**: Not needed (build on server)
- **Database**: Included (containerized PostgreSQL)
- **Redis**: Included (containerized)
- **Total**: **~$48/month**

**💰 Savings: $73-97/month (60-67% reduction)**

## Architecture

```
┌─────────────────────────────────────────┐
│     Digital Ocean Droplet (8GB)         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Nginx (Port 80/443)           │ │
│  │     - SSL Termination             │ │
│  │     - Rate Limiting               │ │
│  │     - Static Caching              │ │
│  └─────────────┬─────────────────────┘ │
│                │                        │
│  ┌─────────────▼─────────────────────┐ │
│  │     Backend API (Port 5000)       │ │
│  │     - Node.js + Express           │ │
│  │     - All endpoints (41)          │ │
│  │     - Business logic              │ │
│  └───┬─────────────────────────┬─────┘ │
│      │                         │        │
│  ┌───▼────────┐      ┌────────▼──────┐ │
│  │ PostgreSQL │      │  Redis Cache  │ │
│  │ (Port 5432)│      │  (Port 6379)  │ │
│  └────────────┘      └───────────────┘ │
└─────────────────────────────────────────┘
```

## Features

✅ **All Services in One**: API, Database, Cache, Proxy
✅ **Production Ready**: Health checks, auto-restart, logging
✅ **High Performance**: Redis caching, Nginx optimization
✅ **Secure**: SSL/TLS, rate limiting, firewall
✅ **Easy Management**: Single docker-compose command
✅ **Cost Effective**: 60-67% cheaper than Kubernetes
✅ **Scalable**: Can handle 1000+ concurrent users

## Quick Start

### 1. Prerequisites

- Digital Ocean droplet (8GB RAM, 4 vCPUs recommended)
- Ubuntu 20.04+ installed
- Domain pointed to droplet IP
- SSH access configured

### 2. Prepare Environment

```bash
# Clone repository (on your local machine)
cd backend

# Copy and configure environment
cp .env.production.example .env.production
nano .env.production  # Fill in your values
```

### 3. Deploy

```bash
# Set droplet IP
export DROPLET_IP=your.droplet.ip.address

# Run deployment script
chmod +x deploy-all-in-one.sh
./deploy-all-in-one.sh
```

That's it! The script will:
- Copy files to droplet
- Install Docker
- Configure firewall
- Build and start all services
- Run database migrations

### 4. Verify Deployment

```bash
# Check if services are running
ssh root@$DROPLET_IP "cd /opt/dolesewonderlandfx/backend && docker compose -f docker-compose.all-in-one.yml ps"

# Test health endpoint
curl http://$DROPLET_IP/health
```

## Manual Deployment

If you prefer manual deployment:

### 1. Copy Files to Droplet

```bash
# SSH into your droplet
ssh root@your.droplet.ip

# Create directory
mkdir -p /opt/dolesewonderlandfx/backend
cd /opt/dolesewonderlandfx/backend

# Clone repository
git clone https://github.com/seludoto/dolesewonderlandfx.git .
```

### 2. Configure Environment

```bash
# Create environment file
cp .env.production.example .env
nano .env  # Edit with your values
```

### 3. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose plugin
apt-get install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

### 4. Start Services

```bash
# Build and start
docker compose -f docker-compose.all-in-one.yml up -d

# View logs
docker compose -f docker-compose.all-in-one.yml logs -f

# Check status
docker compose -f docker-compose.all-in-one.yml ps
```

### 5. Run Migrations

```bash
docker compose -f docker-compose.all-in-one.yml exec backend npm run migrate
```

## Configuration

### Environment Variables

All configuration is in `.env` file. Key settings:

```bash
# Database
DB_PASSWORD=secure_password_here

# Redis
REDIS_PASSWORD=secure_password_here

# JWT
JWT_SECRET=min_32_characters_long

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# SendGrid
SENDGRID_API_KEY=your_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_key
```

Generate secure passwords:
```bash
openssl rand -base64 32
```

### Resource Limits

Adjust in `docker-compose.all-in-one.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Management

### View Logs

```bash
# All services
docker compose -f docker-compose.all-in-one.yml logs -f

# Specific service
docker compose -f docker-compose.all-in-one.yml logs -f backend
docker compose -f docker-compose.all-in-one.yml logs -f postgres
docker compose -f docker-compose.all-in-one.yml logs -f redis
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.all-in-one.yml restart

# Restart specific service
docker compose -f docker-compose.all-in-one.yml restart backend
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.all-in-one.yml up -d --build
```

### Backup Database

```bash
# Create backup
docker compose -f docker-compose.all-in-one.yml exec postgres pg_dump -U postgres dolesewonderlandfx > backup.sql

# Restore backup
docker compose -f docker-compose.all-in-one.yml exec -T postgres psql -U postgres dolesewonderlandfx < backup.sql
```

## SSL Certificate

### Option 1: Certbot (Let's Encrypt)

```bash
# Install Certbot
apt-get install -y certbot

# Get certificate
certbot certonly --standalone -d api.dolesewonderlandfx.me

# Update nginx.conf to use certificates
nano /opt/dolesewonderlandfx/backend/nginx.conf

# Uncomment SSL lines:
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;

# Restart Nginx
docker compose -f docker-compose.all-in-one.yml restart nginx
```

### Option 2: Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Enable SSL/TLS (Full)
3. No certificate needed on server (Cloudflare handles it)

## Monitoring

### Health Checks

```bash
# API health
curl http://your-droplet-ip/health

# Database health
docker compose -f docker-compose.all-in-one.yml exec postgres pg_isready

# Redis health
docker compose -f docker-compose.all-in-one.yml exec redis redis-cli ping
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# View processes
docker compose -f docker-compose.all-in-one.yml top
```

## Performance Tuning

### Database Optimization

Add to `docker-compose.all-in-one.yml` under postgres:

```yaml
command:
  - "postgres"
  - "-c"
  - "max_connections=200"
  - "-c"
  - "shared_buffers=256MB"
  - "-c"
  - "effective_cache_size=1GB"
  - "-c"
  - "maintenance_work_mem=64MB"
  - "-c"
  - "checkpoint_completion_target=0.9"
  - "-c"
  - "wal_buffers=16MB"
  - "-c"
  - "default_statistics_target=100"
```

### Redis Optimization

Add to redis command:

```yaml
command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Nginx Caching

Already configured in `nginx.conf`:
- Gzip compression enabled
- Static file caching (1 year)
- Keepalive connections
- Rate limiting

## Scaling

### Vertical Scaling (Recommended)

Upgrade droplet size:
- **4GB → 8GB**: Better performance
- **8GB → 16GB**: Handle more traffic
- **Add CPU**: Faster response times

### Horizontal Scaling (If Needed)

When single droplet is not enough:

1. **Database**: Move to managed PostgreSQL
2. **Cache**: Move to managed Redis
3. **API**: Add load balancer + multiple droplets
4. **CDN**: Use Cloudflare for static assets

But for most cases, a single 8GB droplet can handle:
- 1000+ concurrent users
- 10,000+ requests/minute
- Millions of records in database

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f docker-compose.all-in-one.yml logs

# Check individual service
docker compose -f docker-compose.all-in-one.yml logs backend

# Restart services
docker compose -f docker-compose.all-in-one.yml restart
```

### Database Connection Issues

```bash
# Check database is running
docker compose -f docker-compose.all-in-one.yml ps postgres

# Test connection
docker compose -f docker-compose.all-in-one.yml exec backend npm run test:db
```

### Out of Memory

```bash
# Check memory usage
free -h

# Add swap space
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000
lsof -i :80

# Kill process
kill -9 <PID>
```

## Security Best Practices

✅ **Firewall**: Only ports 22, 80, 443 open
✅ **Strong Passwords**: Use 32+ character passwords
✅ **Environment Variables**: Never commit `.env` to git
✅ **Regular Updates**: Update Docker images monthly
✅ **SSL/TLS**: Always use HTTPS
✅ **Rate Limiting**: Prevent API abuse
✅ **Backups**: Daily database backups

## Cost Breakdown (8GB Droplet)

- **Droplet**: $48/month
- **Backups (Optional)**: +$9.60/month (20%)
- **Total**: $48-58/month

Compare to:
- Kubernetes cluster: $121-145/month
- **Savings**: $73-97/month

## When to Upgrade?

Consider upgrading to Kubernetes when:
- **Traffic**: >5000 concurrent users
- **Uptime**: Need 99.99% SLA
- **Team**: Multiple developers deploying
- **Complexity**: Need service mesh, auto-scaling

For most startups and small businesses, this all-in-one setup is perfect!

## Support

- **Documentation**: See main README.md
- **Issues**: Create GitHub issue
- **Community**: Join Discord
- **Email**: support@dolesewonderlandfx.me

---

**Last Updated**: November 4, 2025  
**Status**: Production Ready  
**Cost**: ~$48/month  
**Capacity**: 1000+ concurrent users
