# Discourse Forum Deployment Checklist

Complete this checklist to deploy your community forum successfully.

## Pre-Deployment (30 minutes)

### 1. Server Setup ✅

- [ ] Server provisioned (4GB RAM minimum, 8GB recommended)
- [ ] Docker installed (20.10+)
- [ ] Docker Compose installed (2.0+)
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] SSH access configured

**Commands:**
```bash
# Install Docker on Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2. DNS Configuration ✅

- [ ] A record created: `forum.dolesewonderlandfx.me` → Server IP
- [ ] TTL set to 3600 or lower
- [ ] DNS propagation verified (use: https://dnschecker.org)
- [ ] (Optional) Cloudflare configured for CDN

**DNS Records:**
```
Type: A
Name: forum
Value: [YOUR_SERVER_IP]
TTL: 3600
```

### 3. Email Configuration ✅

- [ ] SendGrid account active
- [ ] API key generated
- [ ] Domain verified in SendGrid
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] Test email sent successfully

**SendGrid SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
```

### 4. AWS S3 (Optional) ✅

- [ ] S3 bucket created: `dolesewonderlandfx-forum`
- [ ] IAM user created with S3 permissions
- [ ] Access keys generated
- [ ] Bucket policy configured for public read
- [ ] CORS configured

**S3 CORS Configuration:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://forum.dolesewonderlandfx.me"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## Deployment (20 minutes)

### 5. Clone Repository ✅

```bash
# SSH into your server
ssh user@your-server-ip

# Clone the repository
cd /opt
git clone https://github.com/seludoto/dolesewonderlandfx.git
cd dolesewonderlandfx/services/forum
```

### 6. Configure Environment ✅

- [ ] Copy `.env.example` to `.env`
- [ ] Update `DISCOURSE_HOSTNAME`
- [ ] Update `DISCOURSE_DEVELOPER_EMAILS`
- [ ] Set secure `POSTGRES_PASSWORD`
- [ ] Add `SENDGRID_API_KEY`
- [ ] Add AWS credentials (if using S3)
- [ ] Generate `SSO_SECRET` (if using SSO)

```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env

# Generate secure password
openssl rand -base64 32

# Generate SSO secret
openssl rand -hex 32
```

### 7. Start Services ✅

- [ ] Pull Docker images
- [ ] Start containers
- [ ] Wait for initialization (5-10 minutes)
- [ ] Check logs for errors
- [ ] Verify all services healthy

```bash
# Pull images
docker compose pull

# Start in background
docker compose up -d

# Watch logs
docker compose logs -f discourse

# Check status
docker compose ps
```

### 8. Initial Setup ✅

- [ ] Access forum: `http://forum.dolesewonderlandfx.me`
- [ ] Complete setup wizard
- [ ] Create admin account
- [ ] Verify email works
- [ ] Test posting

**First-time setup:**
1. Open browser to forum URL
2. Click "Sign Up"
3. Enter admin email from `DISCOURSE_DEVELOPER_EMAILS`
4. Check email for confirmation
5. Complete profile setup

## Post-Deployment (40 minutes)

### 9. SSL Certificate ✅

- [ ] Access forum via HTTPS
- [ ] SSL auto-configured (Let's Encrypt)
- [ ] Certificate valid
- [ ] Force HTTPS enabled
- [ ] HSTS header configured

**Verify SSL:**
```bash
curl -I https://forum.dolesewonderlandfx.me
# Look for: Strict-Transport-Security header
```

### 10. Admin Configuration ✅

Access: Admin → Settings

- [ ] Site name set: "DoleSe Wonderland FX Community"
- [ ] Site description added
- [ ] Logo uploaded
- [ ] Favicon uploaded
- [ ] Color scheme customized
- [ ] Email templates customized

### 11. Create Categories ✅

Admin → Categories → New Category

- [ ] 📈 Market Analysis
- [ ] 💡 Trading Strategies
- [ ] 📚 Learning Resources
- [ ] 🔧 Platform Help
- [ ] 💬 General Discussion
- [ ] 📢 Announcements

**Category Settings:**
- Set permissions (who can post/reply)
- Add descriptions
- Choose category colors
- Set default notification levels

### 12. Configure User Settings ✅

Admin → Settings → Users

- [ ] Enable username changes
- [ ] Set minimum username length
- [ ] Configure trust levels
- [ ] Set up user fields (if needed)
- [ ] Enable avatar uploads

### 13. Security Settings ✅

Admin → Settings → Security

- [ ] Enable CORS for your domains
- [ ] Configure rate limits
- [ ] Enable spam protection
- [ ] Set up login required (if private)
- [ ] Configure password requirements
- [ ] Enable 2FA for admins

**CORS Origins:**
```
https://dolesewonderlandfx.me
https://app.dolesewonderlandfx.me
```

### 14. Email Settings ✅

Admin → Settings → Email

- [ ] Test email delivery
- [ ] Configure email templates
- [ ] Set up notification defaults
- [ ] Enable digest emails
- [ ] Configure mailing list mode

**Test email:**
```bash
# Access Rails console
docker compose exec discourse rails c

# Send test email
Email::Sender.new(Email::TestMailer.send_test("admin@dolesewonderlandfx.me")).send
```

### 15. Install Plugins ✅

Admin → Plugins

Recommended plugins:
- [ ] discourse-solved (mark topics as solved)
- [ ] discourse-voting (upvote/downvote)
- [ ] discourse-calendar (events)
- [ ] discourse-data-explorer (analytics)
- [ ] discourse-chat-integration (Discord/Slack)

**Install plugin:**
```bash
# Edit app.yml (if using standard Discourse install)
# Or add to docker-compose.yml environment:
DISCOURSE_PLUGINS=discourse-solved,discourse-voting
```

### 16. SSO Configuration (Optional) ✅

Admin → Settings → Login

- [ ] Enable SSO
- [ ] Set SSO URL: `https://app.dolesewonderlandfx.me/auth/sso`
- [ ] Set SSO secret
- [ ] Enable "SSO overrides email"
- [ ] Enable "SSO overrides username"
- [ ] Test SSO flow

See `SSO_IMPLEMENTATION.md` for detailed setup.

### 17. Backup Configuration ✅

Admin → Backups

- [ ] Enable automatic backups
- [ ] Set backup frequency (daily recommended)
- [ ] Set retention period (7 days minimum)
- [ ] Test backup creation
- [ ] Test backup restore
- [ ] Configure off-site backup storage

**Manual backup:**
```bash
# Create backup
docker compose exec discourse rake admin:backup

# List backups
docker compose exec discourse ls /shared/backups/default/

# Download backup
docker compose cp discourse:/shared/backups/default/backup.tar.gz ./
```

### 18. Performance Tuning ✅

- [ ] Increase UNICORN_WORKERS if needed
- [ ] Enable CDN for assets
- [ ] Configure Redis cache
- [ ] Enable browser caching
- [ ] Optimize database

**Update .env:**
```bash
# For 8GB RAM server
UNICORN_WORKERS=4

# For 4GB RAM server
UNICORN_WORKERS=2
```

### 19. Monitoring Setup ✅

- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation
- [ ] Create health check endpoint
- [ ] Set up alerts

**Health check:**
```bash
curl https://forum.dolesewonderlandfx.me/srv/status
```

### 20. Update Landing Page ✅

- [ ] Update community page with forum link
- [ ] Add forum to navigation menu
- [ ] Update footer links
- [ ] Add forum preview/stats
- [ ] Deploy changes

**File to update:**
```javascript
// apps/web-landing/pages/community.js
<a href="https://forum.dolesewonderlandfx.me">Visit Forum</a>
```

## Integration Testing (30 minutes)

### 21. User Flow Testing ✅

- [ ] User can access forum from landing page
- [ ] User can create account
- [ ] User receives confirmation email
- [ ] User can create topic
- [ ] User can reply to topic
- [ ] User can upload images
- [ ] User can receive notifications
- [ ] User can search discussions

### 22. SSO Testing (if enabled) ✅

- [ ] User logs in on main platform
- [ ] User clicks forum link
- [ ] User automatically logged into forum
- [ ] Username/email synced correctly
- [ ] Avatar synced correctly
- [ ] Logout works on both platforms

### 23. Email Testing ✅

- [ ] Welcome email received
- [ ] Reply notifications work
- [ ] Mention notifications work
- [ ] Digest emails sent
- [ ] Password reset works

### 24. Mobile Testing ✅

- [ ] Forum accessible on mobile
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Images load correctly
- [ ] Navigation works

### 25. Performance Testing ✅

- [ ] Page load time < 3 seconds
- [ ] Search responsive
- [ ] Image uploads fast
- [ ] No memory leaks
- [ ] Database queries optimized

## Launch (10 minutes)

### 26. Pre-Launch Checklist ✅

- [ ] All tests passing
- [ ] SSL working
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Team trained on moderation
- [ ] Community guidelines posted
- [ ] Welcome post created

### 27. Soft Launch ✅

- [ ] Announce to small group
- [ ] Monitor for issues
- [ ] Collect feedback
- [ ] Fix any bugs
- [ ] Prepare for full launch

### 28. Full Launch ✅

- [ ] Announce on main platform
- [ ] Send email to users
- [ ] Post on social media
- [ ] Update documentation
- [ ] Monitor traffic

### 29. Post-Launch Monitoring ✅

First 24 hours:
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Respond to user feedback
- [ ] Fix critical issues
- [ ] Celebrate! 🎉

## Maintenance

### Daily Tasks

- [ ] Check moderation queue
- [ ] Review flagged posts
- [ ] Respond to support requests
- [ ] Check error logs

### Weekly Tasks

- [ ] Review analytics
- [ ] Update categories if needed
- [ ] Feature top posts
- [ ] Engage with community

### Monthly Tasks

- [ ] Review backups
- [ ] Update Discourse
- [ ] Analyze growth metrics
- [ ] Plan community events

## Rollback Plan

If something goes wrong:

```bash
# Stop services
docker compose down

# Restore from backup
docker compose exec -T postgres psql -U discourse discourse < backup.sql

# Restart services
docker compose up -d

# Verify restoration
docker compose logs discourse
```

## Support Resources

- **Discourse Meta**: https://meta.discourse.org
- **Documentation**: https://docs.discourse.org
- **Community**: https://discord.gg/dolesewonderlandfx
- **Support Email**: support@dolesewonderlandfx.me

## Timeline Summary

- **Pre-Deployment**: 30 minutes
- **Deployment**: 20 minutes
- **Post-Deployment**: 40 minutes
- **Integration Testing**: 30 minutes
- **Launch**: 10 minutes

**Total**: ~2.5 hours (first-time setup)

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Server IP**: _____________  
**Version**: Discourse Latest (as of Nov 2025)

✅ **Status**: Ready for deployment!
