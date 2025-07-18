# Domain Configuration Guide for cabana.tdstudiosny.com

## 🚨 Current Status: NOT CONFIGURED

This guide will walk you through setting up the cabana.tdstudiosny.com subdomain for the Fansworld platform.

## 📋 Prerequisites

1. Access to Vercel dashboard (project owner/admin)
2. Access to DNS provider for tdstudiosny.com
3. Vercel project already deployed

## 🔧 Step 1: Vercel Domain Configuration

### Via Vercel Dashboard:

1. **Login to Vercel**
   - Go to https://vercel.com
   - Navigate to the fansworld-lux-starter project

2. **Add Custom Domain**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: `cabana.tdstudiosny.com`
   - Click "Add"

3. **Vercel will provide one of these options:**
   - **CNAME Record** (recommended for subdomains)
     - Host: `cabana`
     - Value: `cname.vercel-dns.com`
   - **A Record** (alternative)
     - Host: `cabana`
     - Value: `76.76.21.21`

### Via Vercel CLI (Alternative):

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Add domain
vercel domains add cabana.tdstudiosny.com
```

## 🌐 Step 2: DNS Configuration

### Configure at your DNS Provider:

1. **Login to your DNS provider** (where tdstudiosny.com is registered)

2. **Add the DNS record provided by Vercel:**

   **For CNAME (Recommended):**
   ```
   Type: CNAME
   Host/Name: cabana
   Value: cname.vercel-dns.com
   TTL: 3600 (or Auto)
   ```

   **For A Record (Alternative):**
   ```
   Type: A
   Host/Name: cabana
   Value: 76.76.21.21
   TTL: 3600 (or Auto)
   ```

3. **Save the DNS record**

## 🔒 Step 3: SSL Certificate Configuration

Vercel automatically provisions SSL certificates once DNS is configured. This process:

1. Starts automatically after domain verification
2. Usually completes within 24 hours
3. Provides free SSL via Let's Encrypt

**To verify SSL status:**
- Check Vercel Dashboard → Settings → Domains
- Look for green checkmark next to domain
- Test: https://cabana.tdstudiosny.com

## 📝 Step 4: Update Project Configuration

### Update vercel.json:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "domains": ["cabana.tdstudiosny.com"]
}
```

### Update environment variables (if needed):

```bash
# .env.production
VITE_APP_URL=https://cabana.tdstudiosny.com
VITE_SITE_URL=https://cabana.tdstudiosny.com
```

## ✅ Step 5: Verification

### DNS Propagation Check:
```bash
# Check DNS propagation
nslookup cabana.tdstudiosny.com

# Alternative
dig cabana.tdstudiosny.com

# Check globally
# Visit: https://www.whatsmydns.net/
# Enter: cabana.tdstudiosny.com
```

### Test the Domain:
1. Visit https://cabana.tdstudiosny.com
2. Check SSL certificate (padlock icon)
3. Verify all pages load correctly
4. Test API endpoints if applicable

## 🚀 Step 6: Deploy with Domain

### Manual Deploy:
```bash
# Deploy to production
vercel --prod

# Or use the deploy script
./deploy.sh
```

### Automatic Deploy:
- Push to main branch
- Vercel will auto-deploy

## 🔍 Troubleshooting

### Domain Not Working:
1. **Check DNS propagation** (can take up to 48 hours)
2. **Verify DNS records** are correct
3. **Clear browser cache**
4. **Check Vercel dashboard** for errors

### SSL Certificate Issues:
1. **Wait 24 hours** for auto-provisioning
2. **Check domain verification** in Vercel
3. **Ensure DNS is properly configured**
4. **Contact Vercel support** if issues persist

### Common Errors:
- **"Invalid domain"**: Check DNS configuration
- **"SSL provisioning failed"**: Verify DNS records
- **"Domain already in use"**: Domain may be claimed by another Vercel project

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **DNS Provider Support**: Check your registrar
- **Project Issues**: Create issue in GitHub repo

## 🎯 Next Steps After Domain Setup

1. Update all marketing materials with new URL
2. Configure analytics for new domain
3. Update social media profiles
4. Test all features on production domain
5. Set up monitoring for uptime

---

**Important:** DNS propagation can take 24-48 hours. Don't panic if the domain doesn't work immediately after configuration.