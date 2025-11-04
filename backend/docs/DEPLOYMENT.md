# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ installed
- AWS Account (for S3)
- SendGrid Account (for emails)
- Stripe Account (for payments)
- Domain name and SSL certificate

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/dolesewonderlandfx.git
cd dolesewonderlandfx/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env` file in the backend directory:

```env
# Server
NODE_ENV=production
PORT=5000

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=dolesefx_production
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=30d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=DoleSe Wonderland FX

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Redis (optional, for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### Using PM2 Process Manager

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Create PM2 ecosystem file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'dolesefx-backend',
    script: './src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

3. Start application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. Configure Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. Install SSL with Certbot:

```bash
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Docker Deployment

1. Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: dolesefx_production
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

3. Deploy:

```bash
docker-compose up -d
```

### Option 3: Cloud Platform (Heroku, DigitalOcean App Platform, AWS)

#### Heroku Deployment

1. Install Heroku CLI and login:

```bash
heroku login
```

2. Create Heroku app:

```bash
heroku create dolesefx-backend
```

3. Add PostgreSQL addon:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Set environment variables:

```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set SENDGRID_API_KEY=your-key
# ... set all other env vars
```

5. Deploy:

```bash
git push heroku main
```

6. Run migrations:

```bash
heroku run npm run db:migrate
```

#### DigitalOcean App Platform

1. Create `app.yaml`:

```yaml
name: dolesefx-backend
services:
  - name: api
    github:
      repo: yourusername/dolesewonderlandfx
      branch: main
      deploy_on_push: true
    source_dir: /backend
    build_command: npm install
    run_command: npm start
    http_port: 5000
    instance_count: 2
    instance_size_slug: professional-xs
    envs:
      - key: NODE_ENV
        value: production
      # Add other env vars

databases:
  - name: dolesefx-db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb
```

2. Deploy via DigitalOcean dashboard or CLI

## AWS Services Configuration

### S3 Bucket Setup

1. Create S3 bucket
2. Configure CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Create IAM user with S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```

## SendGrid Configuration

1. Verify sender domain
2. Create API key with "Mail Send" permission
3. Set up email templates (optional)
4. Configure domain authentication (SPF, DKIM)

## Stripe Configuration

1. Get API keys from Stripe Dashboard
2. Set up webhook endpoint: `https://api.yourdomain.com/api/webhooks/stripe`
3. Configure webhook events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

## Database Backup

### Automated Backups

Create cron job for daily backups:

```bash
# /etc/cron.d/postgres-backup
0 2 * * * postgres pg_dump dolesefx_production | gzip > /backups/dolesefx_$(date +\%Y\%m\%d).sql.gz
```

### Manual Backup

```bash
pg_dump -U your-user dolesefx_production > backup.sql
```

### Restore

```bash
psql -U your-user dolesefx_production < backup.sql
```

## Monitoring & Logging

### Application Monitoring

1. **Sentry** for error tracking:

```bash
npm install @sentry/node
```

```javascript
// In app.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

2. **New Relic** for performance monitoring

3. **DataDog** for comprehensive monitoring

### Log Management

1. Configure log rotation:

```bash
# /etc/logrotate.d/dolesefx
/home/user/dolesefx/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 user user
    sharedscripts
}
```

2. Consider centralized logging:
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - CloudWatch (AWS)
   - Papertrail
   - Loggly

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set strong JWT secret (32+ characters)
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connection
- [ ] Set up firewall rules
- [ ] Configure security headers (Helmet)
- [ ] Enable password complexity requirements
- [ ] Set up 2FA for admin accounts (future)
- [ ] Regular security audits

## Performance Optimization

1. **Database Indexing**: Already configured in models
2. **Connection Pooling**: Configure in database.js
3. **Redis Caching** (optional):

```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
```

4. **CDN for Static Assets**: Use CloudFront or similar
5. **Database Query Optimization**: Use EXPLAIN ANALYZE
6. **Gzip Compression**: Already enabled in Express

## Health Checks

Configure health check endpoint monitoring:

```bash
# Uptime monitoring services
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com
- StatusCake: https://www.statuscake.com
```

Endpoint: `https://api.yourdomain.com/health`

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/dolesefx/backend
            git pull origin main
            npm install --production
            npm run db:migrate
            pm2 restart dolesefx-backend
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database credentials
   - Verify PostgreSQL is running
   - Check firewall rules

2. **S3 Upload Failures**
   - Verify AWS credentials
   - Check bucket permissions
   - Verify CORS configuration

3. **Email Not Sending**
   - Verify SendGrid API key
   - Check sender verification
   - Review SendGrid activity logs

4. **Payment Processing Issues**
   - Verify Stripe keys (test vs live)
   - Check webhook configuration
   - Review Stripe dashboard logs

### Logs Location

- Application logs: `./logs/`
- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

## Scaling Considerations

### Horizontal Scaling

1. Load balancer configuration
2. Session management (Redis)
3. Database read replicas
4. Stateless application design

### Vertical Scaling

1. Upgrade server resources
2. Optimize database queries
3. Implement caching strategies

## Support

For deployment issues:
- Email: devops@dolesefx.com
- Documentation: https://docs.dolesefx.com
- GitHub Issues: https://github.com/yourusername/dolesewonderlandfx/issues
