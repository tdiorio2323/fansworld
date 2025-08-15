# Quick Deployment Setup Guide

This guide helps you set up automated deployment for your FansWorld application.

## ✅ Problem Solved

**Issue**: GitHub Actions YAML was pasted directly into terminal instead of creating workflow files.

**Solution**: Proper GitHub Actions workflows are now configured in `.github/workflows/`

## 🚀 Quick Setup

### 1. DigitalOcean Server Preparation

On your DigitalOcean server:

```bash
# Create web directory
sudo mkdir -p /var/www/fansworld
sudo chown -R www-data:www-data /var/www/fansworld

# Install nginx (if not installed)
sudo apt update && sudo apt install nginx

# Configure nginx site
sudo nano /etc/nginx/sites-available/fansworld
```

Basic nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/fansworld;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/fansworld /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 2. SSH Key Setup

On your local machine:
```bash
# Generate SSH key pair (if not exists)
ssh-keygen -t rsa -b 4096 -C "deployment@fansworld"

# Copy public key to server
ssh-copy-id user@your-server-ip
```

### 3. GitHub Secrets Configuration

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `DO_SERVER_IP`: Your DigitalOcean server IP address
   - `DO_SERVER_USER`: Server username (usually `root` or your user)
   - `DO_SSH_PRIVATE_KEY`: Content of your private SSH key

To get private key content:
```bash
cat ~/.ssh/id_rsa
```

### 4. Test Deployment

Push to main branch or manually trigger workflow:
1. Go to **Actions** tab in GitHub
2. Select "Deploy to DigitalOcean" 
3. Click "Run workflow"

## 🔄 Available Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `pr-validation.yml` | Pull Request | Code validation |
| `deploy-to-digitalocean.yml` | Push to main | DigitalOcean deployment |
| `multi-deploy.yml` | Manual/Push | Multi-platform deployment |
| `ci-cd.yml` | Push/PR | Continuous integration |

## 🛠️ Troubleshooting

### Common Issues:

1. **Permission Denied**: Check SSH key setup and server user permissions
2. **Build Fails**: Ensure all environment variables are set
3. **Nginx 403**: Check file permissions and nginx configuration

### Debug Commands:

```bash
# Check workflow logs in GitHub Actions tab
# SSH into server manually to test:
ssh user@your-server-ip
cd /var/www/fansworld
ls -la

# Check nginx status:
sudo systemctl status nginx
sudo nginx -t
```

## 🎯 Next Steps

1. ✅ Workflows created and configured
2. ⏭️ Set up GitHub secrets
3. ⏭️ Configure DigitalOcean server
4. ⏭️ Test deployment
5. ⏭️ Set up custom domain (optional)

Your FansWorld app is now ready for automated deployment! 🚀