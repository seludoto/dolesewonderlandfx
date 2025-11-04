#!/bin/bash

# DoleSe Wonderland FX - All-in-One Backend Deployment Script
# This script deploys all backend services in a single Docker Compose setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
DROPLET_IP="${DROPLET_IP:-}"
DROPLET_USER="${DROPLET_USER:-root}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_rsa}"
DOMAIN="${DOMAIN:-api.dolesewonderlandfx.me}"

# Check environment
check_environment() {
    log_info "Checking environment variables..."
    
    if [ -z "$DROPLET_IP" ]; then
        log_error "DROPLET_IP is not set. Please set it with: export DROPLET_IP=your.droplet.ip"
        exit 1
    fi
    
    if [ ! -f ".env.production" ]; then
        log_error ".env.production file not found. Please create it from .env.production.example"
        exit 1
    fi
    
    log_success "Environment check completed"
}

# Test SSH connection
test_ssh_connection() {
    log_info "Testing SSH connection to $DROPLET_USER@$DROPLET_IP..."
    
    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" "echo 'SSH connection successful'" > /dev/null 2>&1; then
        log_success "SSH connection successful"
    else
        log_error "SSH connection failed"
        exit 1
    fi
}

# Copy files to droplet
copy_files() {
    log_info "Copying backend files to droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" "mkdir -p /opt/dolesewonderlandfx/backend"
    
    # Copy all necessary files
    rsync -avz -e "ssh -i $SSH_KEY_PATH" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'logs' \
        --exclude 'uploads' \
        ./ "$DROPLET_USER@$DROPLET_IP:/opt/dolesewonderlandfx/backend/"
    
    log_success "Files copied to droplet"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment on droplet..."
    
    scp -i "$SSH_KEY_PATH" .env.production "$DROPLET_USER@$DROPLET_IP:/opt/dolesewonderlandfx/backend/.env"
    
    log_success "Environment configured"
}

# Install Docker
install_docker() {
    log_info "Installing Docker on droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
if command -v docker &> /dev/null; then
    echo "Docker is already installed"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    apt-get install -y docker-compose-plugin
fi
docker --version
docker compose version
EOF
    
    log_success "Docker ready"
}

# Deploy backend
deploy_backend() {
    log_info "Deploying backend services..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
cd /opt/dolesewonderlandfx/backend

# Stop existing containers
docker compose -f docker-compose.all-in-one.yml down

# Pull images and rebuild
docker compose -f docker-compose.all-in-one.yml build --no-cache

# Start services
docker compose -f docker-compose.all-in-one.yml up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 30

# Check status
docker compose -f docker-compose.all-in-one.yml ps

# Show logs
docker compose -f docker-compose.all-in-one.yml logs --tail=50
EOF
    
    log_success "Backend deployed"
}

# Run migrations
run_migrations() {
    log_info "Running database migrations..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
cd /opt/dolesewonderlandfx/backend
docker compose -f docker-compose.all-in-one.yml exec -T backend npm run migrate
EOF
    
    log_success "Migrations completed"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
if ! command -v ufw &> /dev/null; then
    apt-get update
    apt-get install -y ufw
fi
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw status
EOF
    
    log_success "Firewall configured"
}

# Get deployment info
get_deployment_info() {
    echo ""
    echo "=========================================="
    echo "  Backend Deployment Information"
    echo "=========================================="
    echo ""
    echo "API URL: https://$DOMAIN"
    echo "Droplet IP: $DROPLET_IP"
    echo ""
    echo "Services Running:"
    echo "  - Backend API (Node.js)"
    echo "  - PostgreSQL Database"
    echo "  - Redis Cache"
    echo "  - Nginx Reverse Proxy"
    echo ""
    echo "Next Steps:"
    echo "1. Update DNS: Add A record"
    echo "   Type: A"
    echo "   Name: api"
    echo "   Value: $DROPLET_IP"
    echo ""
    echo "2. Configure SSL certificate (Let's Encrypt)"
    echo "3. Test API: http://$DROPLET_IP/health"
    echo ""
    echo "Useful Commands:"
    echo "  View logs:    ssh $DROPLET_USER@$DROPLET_IP 'cd /opt/dolesewonderlandfx/backend && docker compose -f docker-compose.all-in-one.yml logs -f'"
    echo "  Restart:      ssh $DROPLET_USER@$DROPLET_IP 'cd /opt/dolesewonderlandfx/backend && docker compose -f docker-compose.all-in-one.yml restart'"
    echo "  Check status: ssh $DROPLET_USER@$DROPLET_IP 'cd /opt/dolesewonderlandfx/backend && docker compose -f docker-compose.all-in-one.yml ps'"
    echo ""
    echo "=========================================="
    echo ""
}

# Main function
main() {
    echo ""
    echo "=========================================="
    echo "  Backend All-in-One Deployment"
    echo "=========================================="
    echo ""
    
    check_environment
    test_ssh_connection
    copy_files
    setup_environment
    install_docker
    configure_firewall
    deploy_backend
    run_migrations
    get_deployment_info
    
    log_success "🎉 Backend deployment completed!"
}

main "$@"
