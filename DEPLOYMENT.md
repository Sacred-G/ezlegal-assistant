# Deployment Guide for LibreChat at legalez-assistant.sbouldin.com

## Prerequisites

1. A server with Docker and Docker Compose installed
2. Domain name (legalez-assistant.sbouldin.com) with DNS access
3. SSL certificate (will be obtained using Let's Encrypt)

## Deployment Steps

### 1. DNS Configuration
- Add an A record for `legalez-assistant.sbouldin.com` pointing to your server's IP address
- Wait for DNS propagation (can take up to 48 hours, but usually much faster)

### 2. SSL Certificate Setup
Before starting the application, you'll need to obtain SSL certificates. The easiest way is using Let's Encrypt:

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d legalez-assistant.sbouldin.com

# Copy certificates to nginx ssl directory
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/legalez-assistant.sbouldin.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/legalez-assistant.sbouldin.com/privkey.pem nginx/ssl/
```

### 3. Application Deployment

1. Copy all files to your server:
   - docker-compose.yml
   - docker-compose.prod.yml
   - nginx/conf.d/librechat.conf
   - .env (make sure this is properly configured)

2. Start the application:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. Verify the deployment:
   - Check if containers are running: `docker compose ps`
   - Visit https://legalez-assistant.sbouldin.com
   - Check logs if needed: `docker compose logs -f`

### 4. SSL Certificate Renewal

Let's Encrypt certificates expire after 90 days. Set up auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e
# Add this line:
0 0 1 * * certbot renew --quiet && docker compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx
```

## Troubleshooting

1. If the site isn't accessible:
   - Check if DNS has propagated: `nslookup legalez-assistant.sbouldin.com`
   - Verify all containers are running: `docker compose ps`
   - Check nginx logs: `docker compose logs nginx`
   - Ensure ports 80 and 443 are open on your firewall

2. If SSL isn't working:
   - Verify certificate paths in nginx/conf.d/librechat.conf
   - Check nginx error logs
   - Ensure certificates are properly copied to nginx/ssl directory

3. For application issues:
   - Check application logs: `docker compose logs api`
   - Verify environment variables in .env file
   - Ensure all required services are running

## Maintenance

1. To update the application:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. Regular backups:
   - Back up the MongoDB data directory
   - Back up your .env file and SSL certificates
   - Back up any custom configurations

3. Monitoring:
   - Regularly check logs for errors
   - Monitor disk space usage
   - Keep track of SSL certificate expiration dates
