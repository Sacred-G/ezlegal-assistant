# Server Setup Guide

This guide will help you set up a server on a cloud provider. We'll use DigitalOcean as an example, but you can use any cloud provider (AWS, Google Cloud, Linode, etc.).

## Option 1: DigitalOcean (Recommended for Beginners)

1. Create an account at [DigitalOcean](https://www.digitalocean.com)

2. Create a Droplet (Virtual Server):
   - Click "Create" -> "Droplets"
   - Choose settings:
     * Region: Choose closest to your location
     * Image: Ubuntu 22.04 LTS
     * Size: Basic Plan
       - Recommended: 2GB RAM / 2 CPU ($12/month) or higher
     * Authentication: Password or SSH key (SSH key is more secure)

3. After creation, you'll get:
   - IP Address (this is your server IP)
   - Root password (if you chose password authentication)

## Option 2: AWS EC2 (Alternative)

1. Create an account at [AWS](https://aws.amazon.com)

2. Launch an EC2 Instance:
   - Go to EC2 Dashboard
   - Click "Launch Instance"
   - Choose settings:
     * Amazon Machine Image (AMI): Ubuntu Server 22.04 LTS
     * Instance Type: t2.small or t2.medium
     * Configure Security Group:
       - Allow HTTP (Port 80)
       - Allow HTTPS (Port 443)
       - Allow SSH (Port 22)
   - Create or select a key pair for SSH access

3. After launch, you'll get:
   - Public IP Address
   - Connection instructions

## After Server Creation

1. Note down your server's IP address

2. Connect to your server:
   - For Windows: Use PuTTY or Windows Terminal
   ```powershell
   ssh root@your_server_ip
   ```
   
   - For Linux/Mac:
   ```bash
   ssh root@your_server_ip
   ```

3. Run basic security setup:
```bash
# Update system
apt update && apt upgrade -y

# Set up firewall
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw enable
```

## Next Steps

Once you have your server IP address, you can proceed with deployment:

1. Copy all required files to your server:
```bash
scp docker-compose.yml docker-compose.prod.yml deploy.sh nginx/conf.d/librechat.conf .env root@your_server_ip:/root/librechat/
```

2. SSH into your server and run the deployment script:
```bash
ssh root@your_server_ip
cd librechat
chmod +x deploy.sh
sudo ./deploy.sh
```

## Cost Considerations

- DigitalOcean Droplet: Starting at $12/month (2GB RAM)
- AWS EC2: Starting at ~$15/month (t2.small)
- Domain name: ~$10-15/year
- Data transfer: Usually included in basic plans

Remember to monitor your usage and costs, especially if using AWS, as costs can vary based on usage.
