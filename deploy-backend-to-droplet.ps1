# DoleseFX Backend Deployment Script
# Deploys backend to Digital Ocean droplet 134.209.15.243

$DROPLET_IP = "134.209.15.243"
$DEPLOY_SCRIPT = "deploy-backend-to-droplet.sh"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "DoleseFX Backend Deployment" -ForegroundColor Cyan
Write-Host "Target: $DROPLET_IP" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we can reach the droplet
Write-Host "Step 1: Checking droplet connectivity..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName $DROPLET_IP -Port 22 -WarningAction SilentlyContinue

if (-not $connection.TcpTestSucceeded) {
    Write-Host "❌ Cannot connect to droplet on port 22 (SSH)" -ForegroundColor Red
    Write-Host ""
    Write-Host "The droplet SSH port is not accessible. You need to:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://cloud.digitalocean.com/droplets/523031329" -ForegroundColor White
    Write-Host "  2. Click 'Access' → 'Launch Droplet Console'" -ForegroundColor White
    Write-Host "  3. Login to the console" -ForegroundColor White
    Write-Host "  4. Run these commands:" -ForegroundColor White
    Write-Host ""
    Write-Host "     ufw allow 22/tcp" -ForegroundColor Cyan
    Write-Host "     ufw allow 80/tcp" -ForegroundColor Cyan
    Write-Host "     ufw allow 443/tcp" -ForegroundColor Cyan
    Write-Host "     ufw enable" -ForegroundColor Cyan
    Write-Host "     systemctl restart ssh" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  5. Then copy and run the deployment script:" -ForegroundColor White
    Write-Host ""
    Write-Host "     curl -fsSL https://raw.githubusercontent.com/seludoto/dolesewonderlandfx/main/deploy-backend-to-droplet.sh -o deploy.sh" -ForegroundColor Cyan
    Write-Host "     chmod +x deploy.sh" -ForegroundColor Cyan
    Write-Host "     ./deploy.sh" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or manually copy the deployment script from:" -ForegroundColor White
    Write-Host "  deploy-backend-to-droplet.sh" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ Droplet is accessible on port 22" -ForegroundColor Green
Write-Host ""

# Try to copy deployment script via SCP
Write-Host "Step 2: Copying deployment script to droplet..." -ForegroundColor Yellow
Write-Host ""
Write-Host "You'll need to enter the root password for the droplet." -ForegroundColor Yellow
Write-Host "If you don't have it, reset it via Digital Ocean console." -ForegroundColor Yellow
Write-Host ""

try {
    scp "$DEPLOY_SCRIPT" "root@${DROPLET_IP}:/root/deploy.sh"
    
    Write-Host "✅ Deployment script copied successfully" -ForegroundColor Green
    Write-Host ""
    
    # Execute deployment script
    Write-Host "Step 3: Executing deployment script on droplet..." -ForegroundColor Yellow
    Write-Host ""
    
    ssh "root@$DROPLET_IP" "chmod +x /root/deploy.sh && /root/deploy.sh"
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your backend is now running at:" -ForegroundColor White
    Write-Host "  http://$DROPLET_IP:5000/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Test the API: curl http://$DROPLET_IP:5000/health" -ForegroundColor White
    Write-Host "  2. Configure DNS: api.dolesewonderlandfx.me → $DROPLET_IP" -ForegroundColor White
    Write-Host "  3. Setup SSL certificates" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to copy or execute deployment script" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual deployment steps:" -ForegroundColor Yellow
    Write-Host "  1. SSH into droplet: ssh root@$DROPLET_IP" -ForegroundColor White
    Write-Host "  2. Run these commands:" -ForegroundColor White
    Write-Host ""
    Write-Host "     # Update system" -ForegroundColor Cyan
    Write-Host "     apt-get update && apt-get upgrade -y" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "     # Install Docker" -ForegroundColor Cyan
    Write-Host "     curl -fsSL https://get.docker.com -o get-docker.sh" -ForegroundColor Cyan
    Write-Host "     sh get-docker.sh" -ForegroundColor Cyan
    Write-Host "     apt-get install -y docker-compose-plugin" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "     # Clone repository" -ForegroundColor Cyan
    Write-Host "     mkdir -p /opt/dolesewonderlandfx" -ForegroundColor Cyan
    Write-Host "     cd /opt/dolesewonderlandfx" -ForegroundColor Cyan
    Write-Host "     git clone https://github.com/seludoto/dolesewonderlandfx.git ." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "     # Setup backend" -ForegroundColor Cyan
    Write-Host "     cd /opt/dolesewonderlandfx/backend" -ForegroundColor Cyan
    Write-Host "     cp .env.production.example .env" -ForegroundColor Cyan
    Write-Host "     nano .env  # Configure your settings" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "     # Deploy" -ForegroundColor Cyan
    Write-Host "     docker compose -f docker-compose.all-in-one.yml up -d" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""
Write-Host "For more details, see:" -ForegroundColor White
Write-Host "  - COST_OPTIMIZED_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "  - backend/ALL_IN_ONE_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
