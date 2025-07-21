# 🌐 Domain Setup: cabana.tdstudiosny.com

## 🎯 Goal
Connect your custom domain `cabana.tdstudiosny.com` to your Vercel deployment.

## 📋 Step-by-Step Setup

### Step 1: Add Domain to Vercel (2 minutes)
```
1. Go to: https://vercel.com/dashboard
2. Select your "fansworld-lux-starter" project
3. Go to Settings → Domains
4. Click "Add Domain"
5. Enter: cabana.tdstudiosny.com
6. Click "Add"
```

### Step 2: Get DNS Records from Vercel (1 minute)
After adding the domain, Vercel will show you DNS records like:
```
Type: A
Name: cabana
Value: 76.76.19.61

Type: CNAME  
Name: www.cabana
Value: cname.vercel-dns.com
```
**⚠️ Copy these exact values - you'll need them for your DNS provider**

### Step 3: Update DNS at Your Provider (5 minutes)
Go to where you manage `tdstudiosny.com` DNS (likely):
- **Namecheap**: Dashboard → Domain List → Manage
- **GoDaddy**: My Products → DNS Management  
- **Cloudflare**: DNS tab
- **Google Domains**: DNS settings

**Add these records:**
```
Type: A
Name: cabana (or cabana.tdstudiosny.com)  
Value: [IP from Vercel]
TTL: 300

Type: CNAME
Name: www.cabana (or www.cabana.tdstudiosny.com)
Value: cname.vercel-dns.com
TTL: 300
```

### Step 4: Wait for DNS Propagation (5-30 minutes)
```
1. Vercel will automatically verify the domain
2. SSL certificate will be issued automatically
3. Check status in Vercel → Settings → Domains
```

### Step 5: Test Your Domain
```
1. Visit: https://cabana.tdstudiosny.com
2. Should redirect to your FansWorld app
3. Check for SSL lock icon (🔒)
```

## 🔍 DNS Provider Quick Links

### If using **Namecheap**:
1. Login → Domain List → tdstudiosny.com → Manage
2. Advanced DNS tab
3. Add A Record: Host=cabana, Value=[Vercel IP]
4. Add CNAME: Host=www.cabana, Value=cname.vercel-dns.com

### If using **Cloudflare**:
1. Select tdstudiosny.com domain
2. DNS → Records → Add record
3. Add A Record: Name=cabana, IPv4=[Vercel IP], Proxy=DNS only
4. Add CNAME: Name=www.cabana, Target=cname.vercel-dns.com, Proxy=DNS only

### If using **GoDaddy**:
1. My Products → tdstudiosny.com → DNS
2. Add A Record: Host=cabana, Points to=[Vercel IP]
3. Add CNAME: Host=www.cabana, Points to=cname.vercel-dns.com

## ✅ Success Checklist
- [ ] Domain added to Vercel project
- [ ] DNS records copied from Vercel
- [ ] A record added to DNS provider
- [ ] CNAME record added to DNS provider
- [ ] Domain resolves to your app
- [ ] SSL certificate active (https://)

## 🚨 Common Issues

**"Domain not verified"**: DNS records not propagated yet (wait 30 mins)

**"SSL certificate pending"**: Wait for automatic issuance (up to 1 hour)

**"DNS_PROBE_FINISHED_NXDOMAIN"**: DNS records incorrect or not propagated

**"This site can't be reached"**: Check A record points to correct Vercel IP

## 🎊 After Success
Your domain will be live at:
- https://cabana.tdstudiosny.com (main site)
- https://www.cabana.tdstudiosny.com (www redirect)

**Estimated Total Time: 10-40 minutes** (depending on DNS propagation)