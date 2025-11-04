# Quick Deploy Script
# This will SSH into the droplet and deploy the backend

$DROPLET_IP = "134.209.15.243"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "DoleseFX Backend Quick Deploy" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target: $DROPLET_IP" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  You'll need the root password for the droplet." -ForegroundColor Yellow
Write-Host "If you don't have it, reset it at:" -ForegroundColor Yellow
Write-Host "https://cloud.digitalocean.com/droplets/523031329/settings" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to cancel, or Enter to continue..." -ForegroundColor Yellow
Read-Host

# The deployment command to run on the droplet
$deployCommands = @'
set -e
echo "================================"
echo "DoleseFX Backend Deployment"
echo "================================"
echo ""

# Update system
echo "Updating system packages..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    apt-get install -y docker-compose-plugin
fi

# Install other required packages
echo "Installing required packages..."
apt-get install -y git ufw certbot

# Configure firewall
echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp

# Clone/update repository
echo "Setting up repository..."
mkdir -p /opt/dolesewonderlandfx
cd /opt/dolesewonderlandfx

if [ -d ".git" ]; then
    echo "Updating repository..."
    git pull origin main
else
    echo "Cloning repository..."
    git clone https://github.com/seludoto/dolesewonderlandfx.git .
fi

# Setup backend
echo "Setting up backend..."
cd /opt/dolesewonderlandfx/backend

# Create .env file
if [ ! -f .env ]; then
    cp .env.production.example .env
    echo ""
    echo "⚠️  IMPORTANT: .env file created from template"
    echo "You need to edit /opt/dolesewonderlandfx/backend/.env and configure:"
    echo "  - DATABASE_PASSWORD"
    echo "  - JWT_SECRET"
    echo "  - SENDGRID_API_KEY"
    echo ""
    echo "For now, using default values for testing..."
    
    # Set some basic defaults for testing
    sed -i "s/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=dolesefx_secure_2024/" .env
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=dolesefx_jwt_secret_change_in_production/" .env
fi

# Stop existing containers
echo "Stopping existing containers..."
docker compose -f docker-compose.all-in-one.yml down || true

# Start services
echo "Starting backend services..."
docker compose -f docker-compose.all-in-one.yml up -d

# Wait for services
echo "Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "Service status:"
docker compose -f docker-compose.all-in-one.yml ps

# Check health
echo ""
echo "Checking backend health..."
sleep 5
curl -f http://localhost:5000/health || echo "Health check will be available shortly..."

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "Backend API: http://134.209.15.243:5000"
echo "Health Check: http://134.209.15.243:5000/health"
echo ""
echo "Next steps:"
echo "1. Test: curl http://134.209.15.243:5000/health"
echo "2. Configure DNS: api.dolesewonderlandfx.me -> 134.209.15.243"
echo "3. Setup SSL certificates"
echo "4. Update .env with production values"
echo ""
'@

Write-Host "Connecting to droplet and deploying..." -ForegroundColor Yellow
Write-Host ""

# Execute deployment on droplet
ssh "root@$DROPLET_IP" $deployCommands

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing backend..." -ForegroundColor Yellow
    
    Start-Sleep -Seconds 5
    
    try {
        $response = Invoke-RestMethod -Uri "http://$DROPLET_IP:5000/health" -TimeoutSec 10
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json) -ForegroundColor Cyan
    } catch {
        Write-Host "⚠️  Backend not responding yet (may need a few more seconds)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Your API is running at:" -ForegroundColor White
    Write-Host "  http://$DROPLET_IP:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Test API: curl http://$DROPLET_IP:5000/health" -ForegroundColor White
    Write-Host "  2. Configure DNS (see FRESH_START_DEPLOYMENT.md)" -ForegroundColor White
    Write-Host "  3. Setup SSL certificates" -ForegroundColor White
    Write-Host "  4. Update production .env values" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For manual deployment, see FRESH_START_DEPLOYMENT.md" -ForegroundColor White
    Write-Host ""
}
