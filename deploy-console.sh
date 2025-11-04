#!/bin/bash
# DoleseFX Backend Deployment Script
# Copy and paste this entire script into the Digital Ocean droplet console
# Access console at: https://cloud.digitalocean.com/droplets/523031329

set -e

echo "================================"
echo "DoleseFX Backend Deployment"
echo "================================"
echo ""

# Navigate to repository (already cloned)
cd /opt/dolesewonderlandfx/backend

# Create .env file from template
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.production.example .env
    
    # Set secure passwords (CHANGE THESE IN PRODUCTION!)
    sed -i 's/your_secure_postgres_password_here/DoleSeFx_Postgres_2024_Secure!/g' .env
    sed -i 's/your_secure_redis_password_here/DoleSeFx_Redis_2024_Secure!/g' .env
    sed -i 's/your_jwt_secret_minimum_32_characters_long/DoleSeFx_JWT_Secret_2024_Production_Key_Very_Secure_123456/g' .env
    sed -i 's/your_refresh_secret_minimum_32_characters_long/DoleSeFx_Refresh_Secret_2024_Production_Key_Very_Secure_123456/g' .env
    
    echo "⚠️  Default passwords set. Remember to change them for production!"
    echo ""
fi

# Stop any existing containers
echo "Stopping existing containers..."
docker compose -f docker-compose.all-in-one.yml down 2>/dev/null || true

# Pull latest images
echo "Pulling Docker images..."
docker compose -f docker-compose.all-in-one.yml pull 2>/dev/null || true

# Start services
echo "Starting backend services..."
docker compose -f docker-compose.all-in-one.yml up -d

# Wait for services to initialize
echo "Waiting for services to start (30 seconds)..."
sleep 30

# Check service status
echo ""
echo "Service status:"
docker compose -f docker-compose.all-in-one.yml ps

# Test health endpoint
echo ""
echo "Testing backend health..."
sleep 5

if curl -f http://localhost:5000/health 2>/dev/null; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️  Backend health check pending... checking logs:"
    docker compose -f docker-compose.all-in-one.yml logs --tail=50 backend
fi

# Show running containers
echo ""
echo "Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Show resource usage
echo ""
echo "Resource usage:"
docker stats --no-stream

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "Backend API: http://134.209.15.243:5000"
echo "Health Check: http://134.209.15.243:5000/health"
echo ""
echo "Useful commands:"
echo "  # View logs"
echo "  docker compose -f docker-compose.all-in-one.yml logs -f"
echo ""
echo "  # View backend logs only"
echo "  docker compose -f docker-compose.all-in-one.yml logs -f backend"
echo ""
echo "  # Restart services"
echo "  docker compose -f docker-compose.all-in-one.yml restart"
echo ""
echo "  # Monitor resources"
echo "  docker stats"
echo ""
echo "  # Update code"
echo "  cd /opt/dolesewonderlandfx && git pull origin main"
echo "  cd backend && docker compose -f docker-compose.all-in-one.yml up -d --build"
echo ""
