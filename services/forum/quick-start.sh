#!/bin/bash

# DoleSe Wonderland FX - Forum Quick Start Script
# This script automates the initial setup of the Discourse forum

set -e

echo "=========================================="
echo "DoleSe Wonderland FX Forum Setup"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
    echo -e "${YELLOW}Please edit .env with your configuration:${NC}"
    echo "  nano .env"
    echo ""
    echo "Required settings:"
    echo "  - DISCOURSE_HOSTNAME"
    echo "  - DISCOURSE_DEVELOPER_EMAILS"
    echo "  - POSTGRES_PASSWORD"
    echo "  - SENDGRID_API_KEY"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Verify required environment variables
echo "Checking configuration..."
source .env

REQUIRED_VARS=("DISCOURSE_HOSTNAME" "DISCOURSE_DEVELOPER_EMAILS" "POSTGRES_PASSWORD" "SENDGRID_API_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}Error: Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

echo -e "${GREEN}✓ Configuration verified${NC}"

# Check Docker installation
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Check Docker Compose installation
echo "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
    apt-get update
    apt-get install -y docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Configure firewall
echo "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}! UFW not found, skipping firewall configuration${NC}"
fi

# Pull Docker images
echo "Pulling Docker images (this may take a few minutes)..."
docker compose pull
echo -e "${GREEN}✓ Docker images pulled${NC}"

# Start services
echo "Starting services..."
docker compose up -d
echo -e "${GREEN}✓ Services started${NC}"

# Wait for services to be healthy
echo "Waiting for services to initialize (this may take 5-10 minutes)..."
echo "You can monitor progress with: docker compose logs -f discourse"
echo ""

RETRY_COUNT=0
MAX_RETRIES=60

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose ps | grep -q "healthy"; then
        echo -e "${GREEN}✓ Services are healthy${NC}"
        break
    fi
    
    echo -n "."
    sleep 10
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}Services did not become healthy in time${NC}"
    echo "Check logs with: docker compose logs discourse"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Forum setup complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Access your forum: http://${DISCOURSE_HOSTNAME}"
echo "2. Complete the setup wizard"
echo "3. Create your admin account using: ${DISCOURSE_DEVELOPER_EMAILS}"
echo "4. Configure SSL certificate (Let's Encrypt)"
echo "5. Customize your forum settings"
echo ""
echo "Useful commands:"
echo "  View logs:       docker compose logs -f discourse"
echo "  Restart:         docker compose restart"
echo "  Stop:            docker compose down"
echo "  Update:          docker compose pull && docker compose up -d"
echo ""
echo "Documentation: see README.md"
echo "Support: support@dolesewonderlandfx.me"
echo ""
echo -e "${GREEN}Happy community building! 🎉${NC}"
