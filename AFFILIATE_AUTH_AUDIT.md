# 🚨 CRITICAL: Affiliate Links & Authentication Flow Audit

## ❌ **MAJOR ISSUES FOUND**

### 1. **Authentication Bypass Problem**
```typescript
// In useAuth.tsx - Line 170
const BYPASS_AUTH = true; // ⚠️ CRITICAL ISSUE

// This completely bypasses the entire authentication system!
if (BYPASS_AUTH) {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com'
  };
  return { ...context, user: mockUser, loading: false };
}
```
**Impact**: No real authentication happening - affiliate tracking impossible!

### 2. **VIP Code System Disconnected**
```typescript
// VipEntry.tsx only accepts "td" hardcoded
if (vipCode.toLowerCase() === 'td') {
  navigate('/home'); // ⚠️ No database interaction!
}
```
**Problems**:
- ❌ No connection to `invites` table in Supabase
- ❌ No passcode validation
- ❌ No usage tracking
- ❌ No affiliate attribution

### 3. **Invite System Broken Chain**
**Missing Connections**:
- ✅ Database schema exists (invites, referral_codes, etc.)
- ✅ Edge function `redeem-invite` exists  
- ❌ **Frontend never calls the edge function**
- ❌ **VIP Entry page bypasses entire system**

### 4. **Referral Tracking Gaps**
**Components Found**:
- ✅ `InviteRedemption.tsx` - Has proper logic but not used
- ✅ `useReferralProgram.ts` - Full hooks ready
- ✅ URL tracking in `ComingSoon.tsx` 
- ❌ **Main VipEntry.tsx ignores all of this**

## 🔧 **CRITICAL FIXES NEEDED**

### Fix 1: Disable Auth Bypass
```typescript
// src/hooks/useAuth.tsx - Line 170
const BYPASS_AUTH = false; // ❌ Change to false for production
```

### Fix 2: Connect VIP Entry to Real System
```typescript
// VipEntry.tsx needs to call Supabase
const handleVipAccess = async () => {
  if (vipCode.toLowerCase() === 'td') {
    // Check against real invites table
    const { data: invite } = await supabase
      .from('invites')
      .select('*')
      .eq('code', vipCode.toUpperCase())
      .eq('used', false)
      .single();
      
    if (invite) {
      // Mark as used and redirect
      await supabase.functions.invoke('redeem-invite', {
        body: { action: 'use', invite_code: vipCode, user_id: user.id }
      });
      navigate('/home');
    } else {
      setError('Invalid VIP code');
    }
  }
};
```

### Fix 3: Connect Affiliate URLs to Database
**Current URL Flow**:
```
URL: cabana.com?vip=TESTCODE&ref=ABC123
❌ VipEntry ignores 'ref' parameter
❌ No tracking in vip_link_tracking table
```

**Should Be**:
```typescript
useEffect(() => {
  const vipFromUrl = searchParams.get('vip');
  const refFromUrl = searchParams.get('ref');
  
  if (vipFromUrl) setVipCode(vipFromUrl);
  
  if (refFromUrl) {
    // Track the referral click
    supabase.rpc('record_link_click', {
      short_code: refFromUrl,
      user_agent: navigator.userAgent
    });
  }
}, []);
```

## 📊 **Database Verification Needed**

### Check These Tables:
```sql
-- 1. Are there actual invite codes?
SELECT * FROM invites WHERE status = 'active';

-- 2. Are referral programs set up?
SELECT * FROM referral_programs WHERE active = true;

-- 3. Is TD code in database?
SELECT * FROM invites WHERE code = 'TD';
```

### Environment Variables:
```bash
# Verify these exist:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 🎯 **Action Plan**

### Immediate (Critical):
1. ✅ Verify database has invite codes
2. ✅ Set BYPASS_AUTH = false
3. ✅ Connect VipEntry to real Supabase calls
4. ✅ Test actual authentication flow

### Secondary (Important):
1. 🔄 Connect affiliate URL tracking
2. 🔄 Implement referral attribution
3. 🔄 Add commission tracking
4. 🔄 Test full user journey

## 🚨 **Current Risk Level: HIGH**

**Problems**:
- ❌ No real authentication happening
- ❌ VIP codes not validated against database  
- ❌ Affiliate links not tracked
- ❌ No user attribution for referrals
- ❌ Revenue not tied to referrers

**Impact**: 
- Zero affiliate tracking working
- No user registration validation
- No referral commission attribution
- Security bypass in production

---

**RECOMMENDATION**: Fix authentication first, then reconnect VIP system to database.