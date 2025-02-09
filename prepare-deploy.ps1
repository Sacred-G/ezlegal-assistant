# Prepare deployment package script
$ErrorActionPreference = "Stop"

Write-Host "`n=== Checking Required Files ===" -ForegroundColor Green

# List of required files
$requiredFiles = @(
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "nginx/conf.d/librechat.conf",
    ".env",
    "deploy.sh",
    "DEPLOYMENT.md",
    "SERVER_SETUP.md"
)

# Check each required file
$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "Missing: $file" -ForegroundColor Red
    } else {
        Write-Host "Found: $file" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`nError: Missing required files. Please ensure all files are present before deployment." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Creating Deployment Package ===" -ForegroundColor Green

# Create deployment directory
$deployDir = "deploy-package"
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

# Copy required files
foreach ($file in $requiredFiles) {
    $destPath = Join-Path $deployDir $file
    $destDir = Split-Path $destPath -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    }
    
    Copy-Item $file $destPath -Force
    Write-Host "Copied: $file" -ForegroundColor Green
}

# Create ZIP file
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipFile = "librechat-deploy-$timestamp.zip"
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipFile -Force

# Cleanup
Remove-Item -Recurse -Force $deployDir

Write-Host "`n=== Deployment Package Ready ===" -ForegroundColor Green
Write-Host "Created: $zipFile"
Write-Host @"

Next steps:
1. Create a server following SERVER_SETUP.md guide
2. Copy $zipFile to your server:
   scp $zipFile root@your_server_ip:/root/

3. On your server:
   ssh root@your_server_ip
   cd /root
   unzip $zipFile
   cd librechat
   chmod +x deploy.sh
   sudo ./deploy.sh

For detailed instructions, refer to SERVER_SETUP.md and DEPLOYMENT.md
"@
