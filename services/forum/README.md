# DoleSe Wonderland FX - Community Forum

Modern discussion forum powered by [Discourse](https://www.discourse.org/) for the DoleSe Wonderland FX trading community.

## Features

- 📝 **Rich Text Editor** - Format posts with markdown
- 💬 **Real-time Notifications** - Stay updated on replies and mentions
- 🔍 **Powerful Search** - Find discussions quickly
- 🏆 **Badges & Gamification** - Reward active community members
- 👥 **User Profiles** - Build your trading reputation
- 🔐 **SSO Integration** - Single sign-on with main platform
- 📱 **Mobile Responsive** - Works on all devices
- 🌐 **Multi-language Support** - Reach global traders
- 🛡️ **Spam Protection** - Keep community quality high
- 📊 **Analytics** - Track community engagement

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Domain name (forum.dolesewonderlandfx.me)
- SendGrid API key for emails
- (Optional) AWS S3 for file uploads

### Installation

1. **Clone the repository**
   ```bash
   cd services/forum
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the forum**
   ```bash
   docker-compose up -d
   ```

4. **Wait for initialization** (first start takes 5-10 minutes)
   ```bash
   docker-compose logs -f discourse
   ```

5. **Access the forum**
   - Open: http://localhost:8080
   - Or: https://forum.dolesewonderlandfx.me (after DNS setup)

6. **Complete setup wizard**
   - Create admin account
   - Configure site settings
   - Customize appearance

## Configuration

### Required Settings

Edit `.env` file:

```bash
# Your domain
DISCOURSE_HOSTNAME=forum.dolesewonderlandfx.me

# Admin email
DISCOURSE_DEVELOPER_EMAILS=admin@dolesewonderlandfx.me

# Database password
POSTGRES_PASSWORD=your_secure_password

# SendGrid API key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Optional: AWS S3 Storage

Enable S3 for file uploads:

```bash
USE_S3=true
AWS_REGION=us-east-1
S3_BUCKET=dolesewonderlandfx-forum
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Optional: Single Sign-On (SSO)

Enable SSO to allow users to log in with their main platform account:

```bash
ENABLE_SSO=true
SSO_URL=https://app.dolesewonderlandfx.me/auth/sso
SSO_SECRET=your_shared_secret_key
```

## DNS Configuration

Point your domain to the server:

```
Type: A
Name: forum
Value: [YOUR_SERVER_IP]
TTL: 3600
```

Or use CNAME:
```
Type: CNAME
Name: forum
Value: [YOUR_SERVER_HOSTNAME]
TTL: 3600
```

## SSL Certificate

### Option 1: Let's Encrypt (Recommended)

Discourse includes automatic SSL setup:

1. Access your forum via domain (not IP)
2. Follow the SSL setup wizard
3. Certificate auto-renews every 90 days

### Option 2: Cloudflare

1. Add your domain to Cloudflare
2. Enable SSL/TLS (Full)
3. Update DNS to Cloudflare nameservers

### Option 3: Nginx Reverse Proxy

See `nginx-config.conf` for reverse proxy setup.

## Management Commands

### View Logs
```bash
docker-compose logs -f discourse
```

### Restart Services
```bash
docker-compose restart
```

### Backup Data
```bash
# Backup database
docker-compose exec postgres pg_dump -U discourse discourse > backup.sql

# Backup uploads
docker-compose exec discourse tar -czf /shared/backups/uploads.tar.gz /shared/uploads
```

### Restore Data
```bash
# Restore database
docker-compose exec -T postgres psql -U discourse discourse < backup.sql

# Restore uploads
docker-compose exec discourse tar -xzf /shared/backups/uploads.tar.gz -C /
```

### Update Discourse
```bash
docker-compose pull discourse
docker-compose up -d
```

### Access Rails Console
```bash
docker-compose exec discourse rails c
```

## Customization

### Categories

Create default categories for your trading community:

1. 📈 **Market Analysis** - Daily market discussions
2. 💡 **Trading Strategies** - Share and discuss strategies
3. 📚 **Learning Resources** - Educational content
4. 🔧 **Platform Help** - Technical support
5. 💬 **General Discussion** - Off-topic conversations
6. 📢 **Announcements** - Important updates

### Badges

Reward community participation:

- **First Post** - Made their first post
- **Nice Reply** - Reply got 10 likes
- **Good Answer** - Answer accepted by topic author
- **Great Share** - Post got 25 likes
- **Helpful** - Received 10 helpful flags
- **Regular** - Visited 50% of days
- **Leader** - Top contributor

### Themes

Customize appearance:

1. Admin > Customize > Themes
2. Install DoleSe Wonderland FX theme
3. Match brand colors and fonts

### Plugins

Recommended plugins:

- **discourse-solved** - Mark topics as solved
- **discourse-voting** - Upvote/downvote topics
- **discourse-calendar** - Event scheduling
- **discourse-data-explorer** - Advanced analytics
- **discourse-chat-integration** - Discord/Slack notifications

## Integration with Main Platform

### Update Community Page

Update `apps/web-landing/pages/community.js`:

```javascript
<a
  href="https://forum.dolesewonderlandfx.me"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-primary-600 text-white px-8 py-3 rounded-lg"
>
  Visit Forums
</a>
```

### Embed Forum Discussions

Embed specific discussions in your app:

```html
<iframe
  src="https://forum.dolesewonderlandfx.me/t/topic-slug/123/embed"
  width="100%"
  height="600"
></iframe>
```

### SSO Implementation

See `SSO_IMPLEMENTATION.md` for detailed SSO setup.

## Monitoring

### Health Checks

- Forum: http://forum.dolesewonderlandfx.me/srv/status
- Database: `docker-compose exec postgres pg_isready`
- Redis: `docker-compose exec redis redis-cli ping`

### Metrics

Access Discourse admin dashboard:
- Active users
- Posts per day
- Topics created
- Engagement metrics

### Alerts

Set up monitoring with:
- Uptime Robot (uptime monitoring)
- Sentry (error tracking)
- LogDNA (log aggregation)

## Troubleshooting

### Forum Not Starting

```bash
# Check logs
docker-compose logs discourse

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up -d --build
```

### Email Not Sending

1. Verify SendGrid API key
2. Check SPF/DKIM records
3. Test SMTP connection:
   ```bash
   docker-compose exec discourse rails c
   # In console:
   Email.test_email.deliver_now
   ```

### Database Issues

```bash
# Access database
docker-compose exec postgres psql -U discourse

# Check connections
\l
\dt
\q
```

### Performance Issues

1. Increase UNICORN_WORKERS in `.env`
2. Add Redis cache
3. Enable CDN for static assets
4. Optimize PostgreSQL settings

## Security

### Best Practices

1. ✅ Use strong passwords
2. ✅ Enable 2FA for admins
3. ✅ Keep Discourse updated
4. ✅ Configure rate limiting
5. ✅ Enable spam filters
6. ✅ Regular backups
7. ✅ Monitor access logs

### Firewall Rules

```bash
# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow SSH (if needed)
ufw allow 22/tcp

# Enable firewall
ufw enable
```

## Scaling

### Vertical Scaling

Increase server resources:
- 2 CPU → 4 CPU
- 4 GB RAM → 8 GB RAM
- 20 GB disk → 50 GB disk

### Horizontal Scaling

Use load balancer with multiple Discourse instances:
1. Separate database server
2. Separate Redis server
3. Multiple app servers
4. CDN for static assets

## Cost Estimate

### Self-hosted (Digital Ocean)

- **$12/month** - Basic Droplet (2 GB RAM)
- **$24/month** - Standard Droplet (4 GB RAM)
- **$48/month** - Performance Droplet (8 GB RAM)

Plus:
- Domain: $12/year
- S3 storage: ~$5/month
- SendGrid: Free (up to 100 emails/day)

### Managed Hosting

- **$100/month** - Discourse Standard
- **$300/month** - Discourse Business

## Support

### Resources

- **Discourse Meta**: https://meta.discourse.org
- **Documentation**: https://docs.discourse.org
- **API Docs**: https://docs.discourse.org/#tag/Posts

### Community Help

- GitHub Issues: Report bugs
- Discord: Join #forum channel
- Email: support@dolesewonderlandfx.me

## License

This forum setup is based on Discourse (GPL v2).
DoleSe Wonderland FX customizations are proprietary.

---

**Last Updated**: November 4, 2025  
**Version**: 1.0.0  
**Maintained by**: DoleSe Wonderland FX Team
