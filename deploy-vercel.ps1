# DoleSe Wonderland FX - Vercel Deployment Script (PowerShell)
# Run this script to deploy all frontend applications to Vercel

Write-Host "🚀 DoleSe Wonderland FX - Vercel Deployment Script" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Login to Vercel (if not already logged in)
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
vercel login

# Deploy Web Landing (Main Site)
Write-Host "📦 Deploying Web Landing Page..." -ForegroundColor Blue
Set-Location "apps/web-landing"
vercel --prod --name "dolesewonderlandfx-landing" --yes
Set-Location "../.."

# Deploy Admin Panel
Write-Host "📦 Deploying Admin Panel..." -ForegroundColor Blue
Set-Location "apps/admin-panel"
vercel --prod --name "dolesewonderlandfx-admin" --yes
Set-Location "../.."

# Deploy App Frontend
Write-Host "📦 Deploying App Frontend..." -ForegroundColor Blue
Set-Location "apps/app-frontend"
vercel --prod --name "dolesewonderlandfx-app" --yes
Set-Location "../.."

# Deploy Instructor Portal
Write-Host "📦 Deploying Instructor Portal..." -ForegroundColor Blue
Set-Location "apps/instructor-portal"
vercel --prod --name "dolesewonderlandfx-instructor" --yes
Set-Location "../.."

Write-Host "✅ All deployments initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Configure custom domains for each project:" -ForegroundColor White
Write-Host "   - dolesewonderlandfx.me (landing)" -ForegroundColor White
Write-Host "   - admin.dolesewonderlandfx.me (admin)" -ForegroundColor White
Write-Host "   - app.dolesewonderlandfx.me (app)" -ForegroundColor White
Write-Host "   - instructor.dolesewonderlandfx.me (instructor)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your DoleSe Wonderland FX platform is now live!" -ForegroundColor Green