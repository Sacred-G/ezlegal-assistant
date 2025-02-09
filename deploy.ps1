param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "legalez-assistant.sbouldin.com"
)

# Function to check if a command exists
function Test-Command($CommandName) {
    return $null -ne (Get-Command -Name $CommandName -ErrorAction SilentlyContinue)
}

# Function to show progress
function Write-Step($Message) {
    Write-Host "`n=== $Message ===" -ForegroundColor Green
}

# Check prerequisites
Write-Step "Checking Prerequisites"

if (-not (Test-Command "docker")) {
    Write-Host "Docker is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "docker-compose")) {
    Write-Host "Docker Compose is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    exit 1
}

# Create necessary directories
Write-Step "Creating directories"
New-Item -ItemType Directory -Force -Path "nginx/ssl" | Out-Null
New-Item -ItemType Directory -Force -Path "nginx/conf.d" | Out-Null

# Check if files exist
Write-Step "Checking configuration files"
$requiredFiles = @(
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "nginx/conf.d/librechat.conf",
    ".env"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "Missing required file: $file" -ForegroundColor Red
        exit 1
    }
}

# Verify Docker is running
Write-Step "Verifying Docker is running"
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Deploy the application
Write-Step "Deploying the application"
try {
    # Stop any existing containers
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

    # Pull latest images
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

    # Start the application
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to start containers"
    }
} catch {
    Write-Host "Error deploying application: $_" -ForegroundColor Red
    exit 1
}

# Verify deployment
Write-Step "Verifying deployment"
$containers = docker-compose ps
Write-Host "Container status:"
Write-Host $containers

Write-Step "Deployment Complete!"
Write-Host @"

Your LibreChat application has been deployed!

Next steps:
1. Configure your DNS:
   - Add an A record for $Domain pointing to $ServerIP
   - Wait for DNS propagation (can take up to 48 hours)

2. SSL Certificate:
   - Once DNS is propagated, run these commands on your server:
     sudo apt update
     sudo apt install certbot
     sudo certbot certonly --standalone -d $Domain
     
   - Then copy the certificates:
     sudo cp /etc/letsencrypt/live/$Domain/fullchain.pem nginx/ssl/
     sudo cp /etc/letsencrypt/live/$Domain/privkey.pem nginx/ssl/

3. Verify the deployment:
   - Visit https://$Domain once DNS and SSL are configured

For troubleshooting:
- Check logs: docker-compose logs -f
- View status: docker-compose ps
"@
