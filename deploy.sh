#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Default domain
DOMAIN=${1:-"legalez-assistant.sbouldin.com"}

# Function to show progress
show_step() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Error handling
set -e
trap 'echo -e "${RED}Error: Command failed at line $LINENO${NC}"; exit 1' ERR

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

show_step "Checking Prerequisites"

# Check for required commands
for cmd in docker docker-compose certbot; do
    if ! command_exists $cmd; then
        case $cmd in
            docker)
                echo -e "${RED}Docker not found. Installing...${NC}"
                curl -fsSL https://get.docker.com -o get-docker.sh
                sh get-docker.sh
                rm get-docker.sh
                ;;
            docker-compose)
                echo -e "${RED}Docker Compose not found. Installing...${NC}"
                curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                chmod +x /usr/local/bin/docker-compose
                ;;
            certbot)
                echo -e "${RED}Certbot not found. Installing...${NC}"
                apt-get update
                apt-get install -y certbot
                ;;
        esac
    fi
done

show_step "Creating Directories"
mkdir -p nginx/ssl nginx/conf.d

show_step "Checking Configuration Files"
required_files=("docker-compose.yml" "docker-compose.prod.yml" "nginx/conf.d/librechat.conf" ".env")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}Missing required file: $file${NC}"
        exit 1
    fi
done

show_step "Obtaining SSL Certificate"
# Stop any running containers that might use port 80
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true

# Get SSL certificate
certbot certonly --standalone --non-interactive --agree-tos --email admin@$DOMAIN -d $DOMAIN

# Copy certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Set up auto-renewal
cat > /etc/cron.d/certbot-renewal << EOF
0 0 1 * * root certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.yml -f $(pwd)/docker-compose.prod.yml restart nginx
EOF

show_step "Deploying Application"
# Pull latest images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Start the application
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

show_step "Verifying Deployment"
docker-compose ps

show_step "Deployment Complete!"
echo -e "
Your LibreChat application has been deployed!

Configuration Summary:
- Domain: $DOMAIN
- SSL: Configured with Let's Encrypt
- Auto-renewal: Set up via cron

You can now access your application at:
https://$DOMAIN

To monitor your application:
- View logs: docker-compose logs -f
- Check status: docker-compose ps

SSL certificates will auto-renew monthly.
"

# Test the deployment
if command_exists curl; then
    echo "Testing deployment..."
    sleep 10 # Wait for services to fully start
    curl -k -I "https://$DOMAIN" || echo -e "${RED}Warning: Site not yet accessible. DNS might need to propagate.${NC}"
fi
