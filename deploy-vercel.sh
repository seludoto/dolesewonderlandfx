#!/bin/bash

# DoleSe Wonderland FX - Vercel Deployment Script
# This script helps deploy all frontend applications to Vercel

echo "🚀 DoleSe Wonderland FX - Vercel Deployment Script"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel login

# Deploy Web Landing (Main Site)
echo "📦 Deploying Web Landing Page..."
cd apps/web-landing
vercel --prod --name "dolesewonderlandfx-landing" --yes
cd ../..

# Deploy Admin Panel
echo "📦 Deploying Admin Panel..."
cd apps/admin-panel
vercel --prod --name "dolesewonderlandfx-admin" --yes
cd ../..

# Deploy App Frontend
echo "📦 Deploying App Frontend..."
cd apps/app-frontend
vercel --prod --name "dolesewonderlandfx-app" --yes
cd ../..

# Deploy Instructor Portal
echo "📦 Deploying Instructor Portal..."
cd apps/instructor-portal
vercel --prod --name "dolesewonderlandfx-instructor" --yes
cd ../..

echo "✅ All deployments initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Configure custom domains for each project:"
echo "   - dolesewonderlandfx.me (landing)"
echo "   - admin.dolesewonderlandfx.me (admin)"
echo "   - app.dolesewonderlandfx.me (app)"
echo "   - instructor.dolesewonderlandfx.me (instructor)"
echo ""
echo "🎉 Your DoleSe Wonderland FX platform is now live!"