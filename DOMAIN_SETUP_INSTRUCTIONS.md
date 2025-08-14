# 🚀 Cabana Domain Setup - Quick Action Guide

## Step 1: Cloudflare DNS Setup (5 minutes)

1. **Login to Cloudflare**
   - Go to https://dash.cloudflare.com
   - Select the `tdstudiosny.com` domain

2. **Add CNAME Record**
   ```
   Type: CNAME
   Name: cabana
   Target: cname.vercel-dns.com
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

3. **Save the record**

## Step 2: Vercel Domain Configuration (5 minutes)

1. **Login to Vercel**
   - Go to https://vercel.com/dashboard
   - Find your `fansworld` project

2. **Add Custom Domain**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: `cabana.tdstudiosny.com`
   - Click "Add"

3. **Verify Configuration**
   - Vercel will show "Valid Configuration" when DNS propagates
   - SSL certificate will be provisioned automatically (may take 10-30 minutes)

## Step 3: Update Project Configuration (2 minutes)

1. **Update vercel.json** (already exists in your project):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "domains": ["cabana.tdstudiosny.com"]
   }
   ```

2. **Update production environment**:
   - In Vercel dashboard → Settings → Environment Variables
   - Set `VITE_CORS_ORIGIN` to `https://cabana.tdstudiosny.com`

## Step 4: Deploy (5 minutes)

```bash
cd /Users/tylerdiorio/fansworld

# Build the project
npm run build

# Deploy to production
npm run deploy
```

Or use Vercel CLI:
```bash
vercel --prod
```

## Step 5: Verify

After DNS propagates (5-30 minutes):
1. Visit https://cabana.tdstudiosny.com
2. Check SSL certificate (padlock icon)
3. Test the VIP entry flow

## Troubleshooting

**Domain not working?**
- Check DNS propagation: https://www.whatsmydns.net/
- Enter: cabana.tdstudiosny.com
- Should show: cname.vercel-dns.com

**SSL not working?**
- Wait 30 minutes for auto-provisioning
- Check Vercel dashboard for SSL status

**"Invalid domain" error?**
- Ensure CNAME is set to DNS-only (gray cloud) in Cloudflare
- Don't use Cloudflare proxy (orange cloud) with Vercel

## Quick Check Commands

```bash
# Check DNS
nslookup cabana.tdstudiosny.com

# Check with dig
dig cabana.tdstudiosny.com

# Test SSL
curl -I https://cabana.tdstudiosny.com
```

---

✅ **Once complete, Cabana will be live at https://cabana.tdstudiosny.com!**