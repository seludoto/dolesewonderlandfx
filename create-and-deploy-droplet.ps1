# Complete Deployment Script for Digital Ocean
# This will create a new droplet and deploy everything

# Prerequisites:
# 1. doctl installed and authenticated
# 2. SSH key added to Digital Ocean

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DoleSe Wonderland FX - Complete Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DROPLET_NAME = "dolesewonderlandfx-prod"
$DROPLET_SIZE = "s-4vcpu-8gb"  # 8GB RAM, 4 vCPUs - $48/month (good balance)
$DROPLET_REGION = "nyc1"        # New York (or change to sfo3, lon1, etc.)
$DROPLET_IMAGE = "ubuntu-22-04-x64"
$SSH_KEY_NAME = "your-ssh-key-name"  # Update this with your SSH key name

Write-Host "Deployment Configuration:" -ForegroundColor Yellow
Write-Host "  Name: $DROPLET_NAME"
Write-Host "  Size: $DROPLET_SIZE (8GB RAM, 4 vCPUs)"
Write-Host "  Region: $DROPLET_REGION"
Write-Host "  Cost: ~`$48/month"
Write-Host ""

# Check if doctl is authenticated
Write-Host "Checking Digital Ocean authentication..." -ForegroundColor Cyan
$authCheck = doctl account get --format Email 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Not authenticated with Digital Ocean" -ForegroundColor Red
    Write-Host "Run: doctl auth init" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Authenticated as: $authCheck" -ForegroundColor Green
Write-Host ""

# List available SSH keys
Write-Host "Available SSH Keys:" -ForegroundColor Cyan
doctl compute ssh-key list --format ID,Name,Fingerprint
Write-Host ""

$continue = Read-Host "Do you want to create a new droplet? (yes/no)"
if ($continue -ne "yes") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Get SSH key ID
$sshKeyId = Read-Host "Enter SSH Key ID from the list above"

Write-Host ""
Write-Host "Creating droplet..." -ForegroundColor Cyan
Write-Host "This will take 2-3 minutes..." -ForegroundColor Yellow

# Create droplet
$createResult = doctl compute droplet create $DROPLET_NAME `
    --size $DROPLET_SIZE `
    --image $DROPLET_IMAGE `
    --region $DROPLET_REGION `
    --ssh-keys $sshKeyId `
    --wait `
    --format ID,Name,PublicIPv4,Status

Write-Host $createResult

# Get droplet IP
$dropletInfo = doctl compute droplet list --format Name,PublicIPv4 --no-header | Where-Object { $_ -match $DROPLET_NAME }
$DROPLET_IP = ($dropletInfo -split '\s+')[1]

if (-not $DROPLET_IP) {
    Write-Host "ERROR: Could not get droplet IP" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Droplet created successfully!" -ForegroundColor Green
Write-Host "  IP Address: $DROPLET_IP" -ForegroundColor White
Write-Host ""

# Wait for SSH to be ready
Write-Host "Waiting for SSH to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Next Steps (Manual)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Update DNS Records:" -ForegroundColor Yellow
Write-Host "   Add these A records in your DNS provider:"
Write-Host "   - api.dolesewonderlandfx.me → $DROPLET_IP"
Write-Host "   - forum.dolesewonderlandfx.me → $DROPLET_IP"
Write-Host ""
Write-Host "2. SSH into droplet:" -ForegroundColor Yellow
Write-Host "   ssh root@$DROPLET_IP"
Write-Host ""
Write-Host "3. Run on the droplet:" -ForegroundColor Yellow
Write-Host @"
   # Update system
   apt-get update && apt-get upgrade -y
   apt-get install -y curl git ufw

   # Configure firewall
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw --force enable

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   apt-get install -y docker-compose-plugin

   # Create directories
   mkdir -p /opt/dolesewonderlandfx/backend
   mkdir -p /opt/dolesewonderlandfx/forum

   # Clone repository
   cd /opt/dolesewonderlandfx
   git clone https://github.com/seludoto/dolesewonderlandfx.git repo
   
   # Copy backend files
   cp -r repo/backend/* /opt/dolesewonderlandfx/backend/
   
   # Copy forum files
   cp -r repo/services/forum/* /opt/dolesewonderlandfx/forum/

   # Setup backend
   cd /opt/dolesewonderlandfx/backend
   cp .env.production.example .env
   nano .env  # Edit with your configuration

   # Start backend
   docker compose -f docker-compose.all-in-one.yml up -d

   # Setup forum
   cd /opt/dolesewonderlandfx/forum
   cp .env.example .env
   nano .env  # Edit with your configuration

   # Start forum
   docker compose up -d

   # Check status
   docker ps
"@

Write-Host ""
Write-Host "4. Or use the automated deployment script:" -ForegroundColor Yellow
Write-Host "   # From your local machine:"
Write-Host "   cd backend"
Write-Host "   `$env:DROPLET_IP='$DROPLET_IP'"
Write-Host "   .\deploy-all-in-one.ps1"
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Save info to file
$infoFile = "deployment-info-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
@"
DoleSe Wonderland FX Deployment Information
===========================================

Droplet Name: $DROPLET_NAME
Droplet IP: $DROPLET_IP
Droplet Size: $DROPLET_SIZE (8GB RAM, 4 vCPUs)
Region: $DROPLET_REGION
Created: $(Get-Date)

DNS Records to Add:
- api.dolesewonderlandfx.me → $DROPLET_IP
- forum.dolesewonderlandfx.me → $DROPLET_IP

SSH Access:
ssh root@$DROPLET_IP

Deployment Scripts:
- Backend: backend/deploy-all-in-one.sh
- Forum: services/forum/deploy-to-droplet.sh

Documentation:
- COST_OPTIMIZED_DEPLOYMENT.md
- backend/ALL_IN_ONE_DEPLOYMENT.md
- services/forum/README.md

Monthly Cost: ~`$48
"@ | Out-File -FilePath $infoFile

Write-Host "Deployment info saved to: $infoFile" -ForegroundColor Green
Write-Host ""
