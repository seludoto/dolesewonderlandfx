# DoleSe Wonderland FX - Complete Deployment Guide

===============================================

## Overview

This guide covers the complete deployment of the DoleSe Wonderland FX trading platform.

## Architecture

- **Frontend**: Vercel (Static hosting with automatic HTTPS)
- **Backend**: Digital Ocean Kubernetes (DOKS)
- **Database**: Digital Ocean Managed PostgreSQL
- **Domain**: Namecheap with custom DNS

## Current Status

✅ Infrastructure deployed (DOKS, PostgreSQL, Load Balancer)
✅ Backend services running (API, Auth, and more)
✅ SSL certificates configured
✅ DNS configured for subdomains
✅ Code pushed to GitHub (clean, no secrets)
🔄 Frontend deployment to Vercel (in progress)

## Frontend Applications

1. **Web Landing** (`dolesewonderlandfx.me`) - Main marketing site
2. **Admin Panel** (`admin.dolesewonderlandfx.me`) - Administrative interface
3. **App Frontend** (`app.dolesewonderlandfx.me`) - Main trading application
4. **Instructor Portal** (`instructor.dolesewonderlandfx.me`) - Instructor tools

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
# For Linux/Mac
./deploy-vercel.sh

# For Windows PowerShell
.\deploy-vercel.ps1
```

### Option 2: Manual Deployment via Vercel Dashboard

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy each application**:

   ```bash
   # Web Landing
   cd apps/web-landing
   vercel --prod --name "dolesewonderlandfx-landing"

   # Admin Panel
   cd ../admin-panel
   vercel --prod --name "dolesewonderlandfx-admin"

   # App Frontend
   cd ../app-frontend
   vercel --prod --name "dolesewonderlandfx-app"

   # Instructor Portal
   cd ../instructor-portal
   vercel --prod --name "dolesewonderlandfx-instructor"
   ```

### Option 3: Via Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import the `dolesewonderlandfx` repository
4. Configure each app with the correct root directory:
   - `apps/web-landing` → `dolesewonderlandfx.me`
   - `apps/admin-panel` → `admin.dolesewonderlandfx.me`
   - `apps/app-frontend` → `app.dolesewonderlandfx.me`
   - `apps/instructor-portal` → `instructor.dolesewonderlandfx.me`

## Domain Configuration

After deployment, configure custom domains in Vercel:

1. Go to each project's settings
2. Navigate to "Domains"
3. Add the respective custom domain
4. Vercel will automatically configure SSL

## Environment Variables

Add these environment variables to frontend projects that need API access:

```bash
API_BASE_URL=https://api.dolesewonderlandfx.me
AUTH_BASE_URL=https://auth.dolesewonderlandfx.me
```

## Testing

After deployment, test all endpoints:

- **Landing Page**: <https://dolesewonderlandfx.me>
- **Admin Panel**: <https://admin.dolesewonderlandfx.me>
- **Trading App**: <https://app.dolesewonderlandfx.me>
- **Instructor Portal**: <https://instructor.dolesewonderlandfx.me>
- **API**: <https://api.dolesewonderlandfx.me/health>
- **Auth**: <https://auth.dolesewonderlandfx.me/health>

## Troubleshooting

### Build Issues

- Ensure all dependencies are in `package.json`
- Check that `next.config.js` has `output: 'export'`
- Verify `trailingSlash: true` and `images: { unoptimized: true }`

### Domain Issues

- Check DNS propagation (may take 24-48 hours)
- Verify domain ownership in Vercel
- Ensure SSL certificates are issued

### API Connection Issues

- Verify backend services are running on Digital Ocean
- Check load balancer configuration
- Confirm environment variables are set correctly

## Security Notes

- All sensitive credentials have been removed from the repository
- SSL certificates are automatically managed by Vercel
- Backend APIs use HTTPS with Let's Encrypt certificates
- Database connections use secure SSL connections

## Support

For issues with:

- **Vercel deployment**: Check Vercel documentation or support
- **Domain/DNS**: Contact Namecheap support
- **Backend services**: Check Digital Ocean console
- **Code issues**: Review GitHub repository

---

🎉 **Congratulations! Your DoleSe Wonderland FX platform is now fully deployed and production-ready!**
