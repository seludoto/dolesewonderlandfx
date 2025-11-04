#!/bin/bash
set -e

echo "================================"
echo "DoleseFX Backend Deployment"
echo "Deploying to: 134.209.15.243"
echo "================================"

# Configuration
DROPLET_IP="134.209.15.243"
PROJECT_NAME="dolesewonderlandfx"
DEPLOY_DIR="/opt/dolesewonderlandfx"

echo ""
echo "Step 1: Updating system packages..."
apt-get update
apt-get upgrade -y

echo ""
echo "Step 2: Installing required packages..."
apt-get install -y \
  curl \
  git \
  ufw \
  certbot

echo ""
echo "Step 3: Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
  systemctl enable docker
  systemctl start docker
else
  echo "Docker already installed"
fi

echo ""
echo "Step 4: Installing Docker Compose..."
if ! docker compose version &> /dev/null; then
  apt-get install -y docker-compose-plugin
else
  echo "Docker Compose already installed"
fi

echo ""
echo "Step 5: Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5000/tcp  # Backend API (temporary, will use Nginx later)
ufw allow 8080/tcp  # Forum (temporary)
ufw status

echo ""
echo "Step 6: Creating deployment directory..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

echo ""
echo "Step 7: Cloning/updating repository..."
if [ -d "$DEPLOY_DIR/.git" ]; then
  echo "Repository exists, pulling latest changes..."
  git pull origin main
else
  echo "Cloning repository..."
  git clone https://github.com/seludoto/dolesewonderlandfx.git .
fi

echo ""
echo "Step 8: Setting up backend environment..."
cd $DEPLOY_DIR/backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from template..."
  cp .env.production.example .env
  
  echo ""
  echo "⚠️  IMPORTANT: You need to configure the .env file with your settings!"
  echo "Edit /opt/dolesewonderlandfx/backend/.env and update:"
  echo "  - DATABASE_PASSWORD"
  echo "  - JWT_SECRET"
  echo "  - API keys (SendGrid, Redis, etc.)"
  echo ""
  read -p "Press Enter once you've configured the .env file..."
fi

echo ""
echo "Step 9: Stopping any existing containers..."
docker compose -f docker-compose.all-in-one.yml down || true

echo ""
echo "Step 10: Starting backend services..."
docker compose -f docker-compose.all-in-one.yml up -d

echo ""
echo "Step 11: Waiting for services to start..."
sleep 10

echo ""
echo "Step 12: Checking service status..."
docker compose -f docker-compose.all-in-one.yml ps

echo ""
echo "Step 13: Checking backend health..."
curl -f http://localhost:5000/health || echo "⚠️  Backend health check failed"

echo ""
echo "================================"
echo "✅ Backend Deployment Complete!"
echo "================================"
echo ""
echo "Services running:"
echo "  - Backend API: http://$DROPLET_IP:5000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Nginx: http://$DROPLET_IP:80"
echo ""
echo "Next steps:"
echo "  1. Configure DNS records:"
echo "     api.dolesewonderlandfx.me -> $DROPLET_IP"
echo ""
echo "  2. Setup SSL certificates:"
echo "     certbot certonly --standalone -d api.dolesewonderlandfx.me"
echo ""
echo "  3. View logs:"
echo "     cd $DEPLOY_DIR/backend"
echo "     docker compose -f docker-compose.all-in-one.yml logs -f"
echo ""
echo "  4. Monitor resources:"
echo "     docker stats"
echo ""
echo "Memory Usage (2GB droplet - TIGHT!):"
echo "  - PostgreSQL: ~200MB"
echo "  - Redis: ~50MB"
echo "  - Backend: ~300-500MB"
echo "  - Nginx: ~10MB"
echo "  - System: ~200MB"
echo "  Total: ~760-960MB (leaves ~1GB free)"
echo ""
echo "⚠️  Note: This is a 2GB droplet, so memory is tight."
echo "   Consider upgrading to 4GB if you experience issues."
echo ""
