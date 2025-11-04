#!/bin/bash

# DoleSe Wonderland FX - Forum Deployment to Digital Ocean Droplet
# This script deploys the Discourse forum to a Digital Ocean droplet

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
FORUM_DOMAIN="${FORUM_DOMAIN:-forum.dolesewonderlandfx.me}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@dolesewonderlandfx.me}"

# Check if required environment variables are set
check_environment() {
    log_info "Checking environment variables..."
    
    if [ -z "$DROPLET_IP" ]; then
        log_error "DROPLET_IP is not set. Please set it with: export DROPLET_IP=your.droplet.ip"
        exit 1
    fi
    
    if [ -z "$SENDGRID_API_KEY" ]; then
        log_warning "SENDGRID_API_KEY is not set. Email functionality will not work."
    fi
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        log_warning "POSTGRES_PASSWORD is not set. A random password will be generated."
        POSTGRES_PASSWORD=$(openssl rand -base64 32)
        echo "Generated POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
        echo "Save this password!"
    fi
    
    log_success "Environment check completed"
}

# Test SSH connection
test_ssh_connection() {
    log_info "Testing SSH connection to $DROPLET_USER@$DROPLET_IP..."
    
    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" "echo 'SSH connection successful'" > /dev/null 2>&1; then
        log_success "SSH connection successful"
    else
        log_error "SSH connection failed. Please check:"
        echo "  1. DROPLET_IP is correct"
        echo "  2. SSH key is added to droplet"
        echo "  3. Firewall allows SSH (port 22)"
        exit 1
    fi
}

# Copy forum files to droplet
copy_forum_files() {
    log_info "Copying forum files to droplet..."
    
    # Create remote directory
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" "mkdir -p /opt/dolesewonderlandfx/forum"
    
    # Copy forum directory
    scp -r -i "$SSH_KEY_PATH" \
        docker-compose.yml \
        .env.example \
        README.md \
        SSO_IMPLEMENTATION.md \
        DEPLOYMENT_CHECKLIST.md \
        FORUM_IMPLEMENTATION.md \
        nginx-config.conf \
        quick-start.sh \
        "$DROPLET_USER@$DROPLET_IP:/opt/dolesewonderlandfx/forum/"
    
    log_success "Forum files copied to droplet"
}

# Setup environment file on droplet
setup_environment_file() {
    log_info "Setting up environment file on droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << EOF
cd /opt/dolesewonderlandfx/forum

# Copy example to .env
cp .env.example .env

# Update .env with provided values
sed -i 's|DISCOURSE_HOSTNAME=.*|DISCOURSE_HOSTNAME=$FORUM_DOMAIN|g' .env
sed -i 's|DISCOURSE_DEVELOPER_EMAILS=.*|DISCOURSE_DEVELOPER_EMAILS=$ADMIN_EMAIL|g' .env
sed -i 's|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$POSTGRES_PASSWORD|g' .env

# Update SendGrid if provided
if [ -n "$SENDGRID_API_KEY" ]; then
    sed -i 's|SENDGRID_API_KEY=.*|SENDGRID_API_KEY=$SENDGRID_API_KEY|g' .env
fi

# Update AWS credentials if provided
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    sed -i 's|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID|g' .env
    sed -i 's|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY|g' .env
    sed -i 's|USE_S3=.*|USE_S3=true|g' .env
fi

# Update SSO if provided
if [ -n "$SSO_SECRET" ]; then
    sed -i 's|SSO_SECRET=.*|SSO_SECRET=$SSO_SECRET|g' .env
    sed -i 's|ENABLE_SSO=.*|ENABLE_SSO=true|g' .env
fi

echo ".env file configured successfully"
EOF
    
    log_success "Environment file configured"
}

# Install Docker on droplet
install_docker() {
    log_info "Installing Docker on droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
# Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo "Docker is already installed"
    docker --version
else
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Install Docker Compose plugin
    apt-get update
    apt-get install -y docker-compose-plugin
    
    echo "Docker installed successfully"
fi

# Verify installation
docker --version
docker compose version
EOF
    
    log_success "Docker installation completed"
}

# Configure firewall on droplet
configure_firewall() {
    log_info "Configuring firewall on droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
# Install ufw if not installed
if ! command -v ufw &> /dev/null; then
    apt-get update
    apt-get install -y ufw
fi

# Configure firewall rules
ufw --force enable
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw status

echo "Firewall configured successfully"
EOF
    
    log_success "Firewall configured"
}

# Deploy forum using quick-start script
deploy_forum() {
    log_info "Deploying forum on droplet..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
cd /opt/dolesewonderlandfx/forum

# Make script executable
chmod +x quick-start.sh

# Run deployment
./quick-start.sh

echo "Forum deployment initiated"
EOF
    
    log_success "Forum deployment started"
}

# Monitor forum startup
monitor_startup() {
    log_info "Monitoring forum startup (this may take 5-10 minutes)..."
    
    ssh -i "$SSH_KEY_PATH" "$DROPLET_USER@$DROPLET_IP" << 'EOF'
cd /opt/dolesewonderlandfx/forum

echo "Waiting for services to start..."
sleep 30

# Check status
echo "=== Docker Container Status ==="
docker compose ps

echo ""
echo "=== Discourse Logs (last 50 lines) ==="
docker compose logs --tail=50 discourse

echo ""
echo "=== Service Health ==="
docker compose ps | grep "healthy" && echo "✓ Services are healthy" || echo "⚠ Services are starting..."
EOF
    
    log_success "Startup monitoring completed"
}

# Get deployment info
get_deployment_info() {
    log_info "Getting deployment information..."
    
    echo ""
    echo "=========================================="
    echo "  Forum Deployment Information"
    echo "=========================================="
    echo ""
    echo "Forum URL: http://$FORUM_DOMAIN"
    echo "Droplet IP: $DROPLET_IP"
    echo "Admin Email: $ADMIN_EMAIL"
    echo ""
    echo "Next Steps:"
    echo "1. Update DNS: Add A record"
    echo "   Type: A"
    echo "   Name: forum"
    echo "   Value: $DROPLET_IP"
    echo "   TTL: 3600"
    echo ""
    echo "2. Access forum: http://$FORUM_DOMAIN (after DNS propagation)"
    echo "   Or directly: http://$DROPLET_IP:8080"
    echo ""
    echo "3. Complete setup wizard"
    echo "   - Create admin account"
    echo "   - Configure SSL certificate"
    echo "   - Customize appearance"
    echo ""
    echo "Useful Commands (run on droplet):"
    echo "  View logs:       cd /opt/dolesewonderlandfx/forum && docker compose logs -f discourse"
    echo "  Restart:         cd /opt/dolesewonderlandfx/forum && docker compose restart"
    echo "  Stop:            cd /opt/dolesewonderlandfx/forum && docker compose down"
    echo "  Update:          cd /opt/dolesewonderlandfx/forum && docker compose pull && docker compose up -d"
    echo ""
    echo "=========================================="
    echo ""
    
    log_success "Deployment information displayed"
}

# Main deployment function
main() {
    echo ""
    echo "=========================================="
    echo "  DoleSe Wonderland FX - Forum Deployment"
    echo "=========================================="
    echo ""
    
    check_environment
    test_ssh_connection
    copy_forum_files
    setup_environment_file
    install_docker
    configure_firewall
    deploy_forum
    monitor_startup
    get_deployment_info
    
    echo ""
    log_success "🎉 Forum deployment completed successfully!"
    echo ""
}

# Run main function
main "$@"
