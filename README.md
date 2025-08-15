# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ab5a1da0-52c5-455c-ae12-01a7caaf28fe

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ab5a1da0-52c5-455c-ae12-01a7caaf28fe) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project supports multiple deployment methods:

### GitHub Actions (Recommended)
Automated deployment workflows are configured for:
- **DigitalOcean**: Automated deployment via SSH and SCP
- **Vercel**: Integration with Vercel platform
- **Multi-platform**: Deploy to both platforms simultaneously

See [GitHub Actions Documentation](.github/workflows/README.md) for setup instructions.

### Manual Deployment

**Vercel (Quick)**:
```sh
npm install -g vercel
vercel --prod
```

**DigitalOcean or Custom Server**:
```sh
npm run build
# Upload dist/ folder to your server
```

**Using Deploy Script**:
```sh
./deploy.sh
```

## GitHub Actions Workflows

This repository includes automated CI/CD workflows:

- ✅ **Pull Request Validation**: Automatic code validation on PRs
- ✅ **DigitalOcean Deployment**: Deploy to your server on main branch pushes  
- ✅ **Multi-Platform Deployment**: Flexible deployment options
- ✅ **Continuous Integration**: Build, test, and lint automation

Configure deployment by adding these secrets to your GitHub repository:
- `DO_SERVER_IP` - Your DigitalOcean server IP
- `DO_SERVER_USER` - Server username
- `DO_SSH_PRIVATE_KEY` - SSH private key for server access

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
