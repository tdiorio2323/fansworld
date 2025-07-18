# Supabase Key Information

## Current Keys in Project

### In .env.local:
- **URL**: `https://ydrlcunmhcgmbxpsztbo.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT format)

### New Key Provided:
- **Publishable Key**: `sb_publishable_Wj0xmPCyTCgJflwjRKd4yg_903lmcmp`

## Key Types Explained

1. **Anon Key (Currently Used)**
   - JWT format starting with `eyJ...`
   - Used for client-side authentication
   - Safe to expose in frontend code
   - Currently working in your project

2. **Publishable Key (New Format)**
   - Starts with `sb_publishable_`
   - Newer Supabase key format
   - Also safe for client-side use

## Action Required?

**If this is from a DIFFERENT Supabase project:**
- You would need to update BOTH the URL and key
- All database migrations would need to be re-run
- User data would not carry over

**If this is from the SAME Supabase project:**
- The current JWT key is still valid and working
- No immediate action needed
- Both key formats can work

## To Update Keys (if needed):

1. Update `.env.local`:
```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-NEW-KEY]
```

2. Update `.env.production`:
```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-NEW-KEY]
```

3. Rebuild and redeploy:
```bash
npm run build
vercel --prod
```

## Current Status
- ✅ Project is working with current keys
- ✅ Database connections are active
- ✅ Authentication is functional

**Note**: Only update if you're switching to a different Supabase project or if the current keys stop working.