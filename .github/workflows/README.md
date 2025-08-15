# GitHub Actions Workflows

This repository includes several GitHub Actions workflows for CI/CD automation.

## Available Workflows

### 1. Pull Request Validation (`pr-validation.yml`)
- **Trigger**: Pull requests to `main` or `develop` branches
- **Purpose**: Validates code changes before merging
- **Actions**: Type checking, tests, build validation, linting

### 2. CI/CD Pipeline (`ci-cd.yml`)
- **Trigger**: Push to `main` or `develop`, pull requests to `main`
- **Purpose**: Continuous integration and basic deployment prep
- **Actions**: Build, test, lint, artifact creation

### 3. DigitalOcean Deployment (`deploy-to-digitalocean.yml`)
- **Trigger**: Push to `main` branch or manual dispatch
- **Purpose**: Deploy built application to DigitalOcean server
- **Actions**: Build, SCP transfer, server configuration

### 4. Multi-Platform Deployment (`multi-deploy.yml`)
- **Trigger**: Push to `main`, tags, or manual dispatch with options
- **Purpose**: Deploy to multiple platforms (DigitalOcean, Vercel)
- **Actions**: Flexible deployment with target selection

## Required Secrets

For DigitalOcean deployment, add these secrets to your GitHub repository:

```
DO_SERVER_IP=your.server.ip.address
DO_SERVER_USER=your_server_username
DO_SSH_PRIVATE_KEY=your_private_key_content
```

For Vercel deployment (optional):

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## Setup Instructions

1. **DigitalOcean Server Setup**:
   - Ensure your server has nginx configured
   - Create directory: `/var/www/fansworld`
   - Set proper permissions for web server user

2. **GitHub Secrets**:
   - Go to Repository Settings > Secrets and variables > Actions
   - Add the required secrets listed above

3. **SSH Key Setup**:
   - Generate SSH key pair: `ssh-keygen -t rsa -b 4096`
   - Add public key to server's `~/.ssh/authorized_keys`
   - Add private key content to `DO_SSH_PRIVATE_KEY` secret

## Manual Deployment

You can trigger deployments manually:

1. Go to Actions tab in GitHub
2. Select "Multi-Platform Deployment"
3. Click "Run workflow"
4. Choose deployment target (digitalocean, vercel, or both)

## Workflow Status

- ✅ **Build**: Application builds successfully
- ⚠️ **Linting**: ESLint issues present but non-blocking
- ✅ **Tests**: Test suite passes
- ✅ **Deployment**: Ready for production deployment