#!/bin/bash

# Backend Installation Script
# This script sets up the DoleSe Wonderland FX backend

set -e

echo "🚀 DoleSe Wonderland FX Backend Setup"
echo "======================================"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. You have version $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not detected. Please ensure PostgreSQL 12+ is installed."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your configuration before running the server"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
echo ""
echo "📁 Creating logs directory..."
mkdir -p logs
echo "✅ Logs directory created"

# Setup database
echo ""
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    npm run db:migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed"
        
        read -p "Do you want to seed the database with demo data? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm run db:seed
            echo "✅ Database seeded with demo data"
            echo ""
            echo "Demo accounts created:"
            echo "  Admin:      admin@dolesefx.com / Admin@123"
            echo "  Instructor: instructor@dolesefx.com / Admin@123"
            echo "  Student:    student@dolesefx.com / Admin@123"
        fi
    else
        echo "⚠️  Database migration failed. Please check your database configuration."
    fi
fi

# Run tests
echo ""
read -p "Do you want to run tests? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧪 Running tests..."
    npm test
fi

echo ""
echo "======================================"
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start development server: npm run dev"
echo "3. Start production server: npm start"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm start            - Start production server"
echo "  npm test             - Run tests"
echo "  npm run test:watch   - Run tests in watch mode"
echo "  npm run lint         - Run linter"
echo "  npm run format       - Format code"
echo "  npm run db:migrate   - Run database migrations"
echo "  npm run db:seed      - Seed database"
echo ""
echo "Documentation:"
echo "  README.md            - Getting started guide"
echo "  docs/API_DOCUMENTATION.md  - API endpoints"
echo "  docs/TESTING.md      - Testing guide"
echo "  docs/DEPLOYMENT.md   - Deployment guide"
echo ""
echo "Happy coding! 🎉"
