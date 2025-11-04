# DoleSe Wonderland FX - Forum Deployment to Digital Ocean Droplet (PowerShell)
# This script deploys the Discourse forum to a Digital Ocean droplet from Windows

param(
    [string]$DropletIP = $env:DROPLET_IP,
    [string]$DropletUser = "root",
    [string]$SSHKeyPath = "$env:USERPROFILE\.ssh\id_rsa",
    [string]$ForumDomain = "forum.dolesewonderlandfx.me",
    [string]$AdminEmail = "admin@dolesewonderlandfx.me",
    [string]$SendGridAPIKey = $env:SENDGRID_API_KEY,
    [string]$PostgresPassword = $env:POSTGRES_PASSWORD,
    [string]$AWSAccessKeyID = $env:AWS_ACCESS_KEY_ID,
    [string]$AWSSecretAccessKey = $env:AWS_SECRET_ACCESS_KEY,
    [string]$SSOSecret = $env:SSO_SECRET
)

# Colors for output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check for SSH
    if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
        Write-Error "SSH is not available. Please install OpenSSH or use Git Bash."
        exit 1
    }
    
    # Check for SCP
    if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
        Write-Error "SCP is not available. Please install OpenSSH or use Git Bash."
        exit 1
    }
    
    Write-Success "Prerequisites check passed"
}

# Check environment variables
function Test-Environment {
    Write-Info "Checking environment variables..."
    
    if (-not $DropletIP) {
        Write-Error "DROPLET_IP is not set. Please provide it using -DropletIP parameter or set `$env:DROPLET_IP"
        Write-Host "Example: .\deploy-to-droplet.ps1 -DropletIP 164.90.xxx.xxx"
        exit 1
    }
    
    if (-not $SendGridAPIKey) {
        Write-Warning "SENDGRID_API_KEY is not set. Email functionality will not work."
    }
    
    if (-not $PostgresPassword) {
        Write-Warning "POSTGRES_PASSWORD is not set. A random password will be generated."
        # Generate random password
        $PostgresPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        Write-Host "Generated POSTGRES_PASSWORD: $PostgresPassword" -ForegroundColor Yellow
        Write-Host "Save this password!" -ForegroundColor Yellow
    }
    
    Write-Success "Environment check completed"
}

# Test SSH connection
function Test-SSHConnection {
    Write-Info "Testing SSH connection to $DropletUser@$DropletIP..."
    
    $result = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i $SSHKeyPath $DropletUser@$DropletIP "echo 'SSH connection successful'" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "SSH connection successful"
    } else {
        Write-Error "SSH connection failed. Please check:"
        Write-Host "  1. DROPLET_IP is correct: $DropletIP"
        Write-Host "  2. SSH key exists at: $SSHKeyPath"
        Write-Host "  3. SSH key is added to droplet"
        Write-Host "  4. Firewall allows SSH (port 22)"
        exit 1
    }
}

# Copy forum files to droplet
function Copy-ForumFiles {
    Write-Info "Copying forum files to droplet..."
    
    # Create remote directory
    ssh -i $SSHKeyPath $DropletUser@$DropletIP "mkdir -p /opt/dolesewonderlandfx/forum"
    
    # Copy forum files
    $files = @(
        "docker-compose.yml",
        ".env.example",
        "README.md",
        "SSO_IMPLEMENTATION.md",
        "DEPLOYMENT_CHECKLIST.md",
        "FORUM_IMPLEMENTATION.md",
        "nginx-config.conf",
        "quick-start.sh"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Info "Copying $file..."
            scp -i $SSHKeyPath $file ${DropletUser}@${DropletIP}:/opt/dolesewonderlandfx/forum/
        } else {
            Write-Warning "File not found: $file"
        }
    }
    
    Write-Success "Forum files copied to droplet"
}

# Setup environment file on droplet
function Set-EnvironmentFile {
    Write-Info "Setting up environment file on droplet..."
    
    $envSetupScript = @"
cd /opt/dolesewonderlandfx/forum
cp .env.example .env
sed -i 's|DISCOURSE_HOSTNAME=.*|DISCOURSE_HOSTNAME=$ForumDomain|g' .env
sed -i 's|DISCOURSE_DEVELOPER_EMAILS=.*|DISCOURSE_DEVELOPER_EMAILS=$AdminEmail|g' .env
sed -i 's|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$PostgresPassword|g' .env
"@
    
    if ($SendGridAPIKey) {
        $envSetupScript += "sed -i 's|SENDGRID_API_KEY=.*|SENDGRID_API_KEY=$SendGridAPIKey|g' .env`n"
    }
    
    if ($AWSAccessKeyID -and $AWSSecretAccessKey) {
        $envSetupScript += @"
sed -i 's|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$AWSAccessKeyID|g' .env
sed -i 's|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=$AWSSecretAccessKey|g' .env
sed -i 's|USE_S3=.*|USE_S3=true|g' .env
"@
    }
    
    if ($SSOSecret) {
        $envSetupScript += @"
sed -i 's|SSO_SECRET=.*|SSO_SECRET=$SSOSecret|g' .env
sed -i 's|ENABLE_SSO=.*|ENABLE_SSO=true|g' .env
"@
    }
    
    $envSetupScript += "echo '.env file configured successfully'"
    
    ssh -i $SSHKeyPath $DropletUser@$DropletIP $envSetupScript
    
    Write-Success "Environment file configured"
}

# Install Docker on droplet
function Install-Docker {
    Write-Info "Installing Docker on droplet..."
    
    $dockerInstallScript = @'
if command -v docker &> /dev/null; then
    echo "Docker is already installed"
    docker --version
else
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    apt-get update
    apt-get install -y docker-compose-plugin
    echo "Docker installed successfully"
fi
docker --version
docker compose version
'@
    
    ssh -i $SSHKeyPath $DropletUser@$DropletIP $dockerInstallScript
    
    Write-Success "Docker installation completed"
}

# Configure firewall on droplet
function Set-Firewall {
    Write-Info "Configuring firewall on droplet..."
    
    $firewallScript = @'
if ! command -v ufw &> /dev/null; then
    apt-get update
    apt-get install -y ufw
fi
ufw --force enable
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw status
echo "Firewall configured successfully"
'@
    
    ssh -i $SSHKeyPath $DropletUser@$DropletIP $firewallScript
    
    Write-Success "Firewall configured"
}

# Deploy forum
function Deploy-Forum {
    Write-Info "Deploying forum on droplet..."
    
    $deployScript = @'
cd /opt/dolesewonderlandfx/forum
chmod +x quick-start.sh
./quick-start.sh
echo "Forum deployment initiated"
'@
    
    ssh -i $SSHKeyPath $DropletUser@$DropletIP $deployScript
    
    Write-Success "Forum deployment started"
}

# Monitor startup
function Watch-Startup {
    Write-Info "Monitoring forum startup (this may take 5-10 minutes)..."
    
    $monitorScript = @'
cd /opt/dolesewonderlandfx/forum
echo "Waiting for services to start..."
sleep 30
echo "=== Docker Container Status ==="
docker compose ps
echo ""
echo "=== Discourse Logs (last 50 lines) ==="
docker compose logs --tail=50 discourse
echo ""
echo "=== Service Health ==="
docker compose ps | grep "healthy" && echo "✓ Services are healthy" || echo "⚠ Services are starting..."
'@
    
    ssh -i $SSHKeyPath $DropletUser@$DropletIP $monitorScript
    
    Write-Success "Startup monitoring completed"
}

# Get deployment info
function Get-DeploymentInfo {
    Write-Info "Getting deployment information..."
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Forum Deployment Information" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Forum URL: http://$ForumDomain" -ForegroundColor White
    Write-Host "Droplet IP: $DropletIP" -ForegroundColor White
    Write-Host "Admin Email: $AdminEmail" -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Update DNS: Add A record" -ForegroundColor White
    Write-Host "   Type: A"
    Write-Host "   Name: forum"
    Write-Host "   Value: $DropletIP"
    Write-Host "   TTL: 3600"
    Write-Host ""
    Write-Host "2. Access forum: http://$ForumDomain (after DNS propagation)" -ForegroundColor White
    Write-Host "   Or directly: http://${DropletIP}:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Complete setup wizard" -ForegroundColor White
    Write-Host "   - Create admin account"
    Write-Host "   - Configure SSL certificate"
    Write-Host "   - Customize appearance"
    Write-Host ""
    Write-Host "Useful Commands (run on droplet via SSH):" -ForegroundColor Yellow
    Write-Host "  View logs:       cd /opt/dolesewonderlandfx/forum && docker compose logs -f discourse"
    Write-Host "  Restart:         cd /opt/dolesewonderlandfx/forum && docker compose restart"
    Write-Host "  Stop:            cd /opt/dolesewonderlandfx/forum && docker compose down"
    Write-Host "  Update:          cd /opt/dolesewonderlandfx/forum && docker compose pull && docker compose up -d"
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Success "Deployment information displayed"
}

# Main deployment function
function Start-Deployment {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  DoleSe Wonderland FX - Forum Deployment" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-Prerequisites
    Test-Environment
    Test-SSHConnection
    Copy-ForumFiles
    Set-EnvironmentFile
    Install-Docker
    Set-Firewall
    Deploy-Forum
    Watch-Startup
    Get-DeploymentInfo
    
    Write-Host ""
    Write-Success "🎉 Forum deployment completed successfully!"
    Write-Host ""
}

# Run deployment
Start-Deployment
