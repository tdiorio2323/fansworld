# 🔐 Cabana Authentication Flow Test Checklist

## Pre-Test Setup

1. **Database Schema**
   - [ ] Run `sql/fix-invites-schema.sql` in Supabase SQL Editor
   - [ ] Verify columns: invite_code, status, passcode, max_uses, current_uses

2. **Create Test VIP Codes**
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO invites (invite_code, passcode, status, max_uses, current_uses, expires_at, description)
   VALUES 
   ('TEST123', 'pass123', 'active', 1, 0, NOW() + INTERVAL '7 days', 'Test code 1'),
   ('FOUNDER50', 'founder', 'active', 50, 0, NOW() + INTERVAL '30 days', 'Founder tier'),
   ('EARLY100', 'early', 'active', 100, 0, NOW() + INTERVAL '14 days', 'Early access');
   ```

## Test Scenarios

### ✅ Scenario 1: Happy Path
1. [ ] Go to https://cabana.tdstudiosny.com (or localhost:8081)
2. [ ] Enter email on landing page
3. [ ] System generates VIP code → redirects to /vip?code=XXXXXX
4. [ ] Code auto-fills in VIP entry form
5. [ ] Click "Unlock Access"
6. [ ] Verify redirected to registration
7. [ ] Check database: invite status = 'used', current_uses = 1

### ✅ Scenario 2: Direct VIP URL
1. [ ] Visit /vip?code=TEST123
2. [ ] Code auto-populates
3. [ ] Submit works correctly
4. [ ] Invite marked as used

### ✅ Scenario 3: Invalid Code
1. [ ] Enter invalid code "WRONG999"
2. [ ] Error message appears
3. [ ] No database changes

### ✅ Scenario 4: Expired Code
1. [ ] Create expired code:
   ```sql
   INSERT INTO invites (invite_code, status, expires_at)
   VALUES ('EXPIRED1', 'active', NOW() - INTERVAL '1 day');
   ```
2. [ ] Try to use EXPIRED1
3. [ ] Should be rejected

### ✅ Scenario 5: Already Used Code
1. [ ] Use TEST123 once successfully
2. [ ] Try to use TEST123 again
3. [ ] Should be rejected (status = 'used')

### ✅ Scenario 6: Affiliate Tracking
1. [ ] Visit /vip?code=TEST123&ref=AFFILIATE1
2. [ ] Check link_tracking table for entry
3. [ ] Verify affiliate code saved

### ✅ Scenario 7: Rate Limiting
1. [ ] Try 6+ invalid codes rapidly
2. [ ] Should hit rate limit
3. [ ] Wait 15 minutes, try again

## Security Checks

### Authentication Bypass Prevention
1. [ ] Try accessing /dashboard without auth → redirected to login
2. [ ] Try accessing /feed without auth → redirected to login
3. [ ] Try accessing /admin without auth → redirected to login
4. [ ] No hardcoded bypass flags in code

### API Security
1. [ ] Check browser DevTools Network tab
2. [ ] Supabase anon key visible (expected)
3. [ ] No secret keys exposed
4. [ ] CORS properly configured

## Database Verification

Run these queries to verify data:

```sql
-- Check all invites
SELECT invite_code, status, current_uses, max_uses, expires_at 
FROM invites 
ORDER BY created_at DESC;

-- Check used invites
SELECT * FROM invites WHERE status = 'used';

-- Check tracking
SELECT * FROM link_tracking ORDER BY created_at DESC;

-- Check VIP link tracking
SELECT * FROM vip_link_tracking ORDER BY created_at DESC;
```

## Integration Points Test

### Supabase
- [ ] Auth working
- [ ] Database queries working
- [ ] Real-time subscriptions (if used)

### Stripe (if configured)
- [ ] Test mode payment works
- [ ] Webhook receives events

### Email (if configured)
- [ ] Welcome email sent
- [ ] VIP code email sent

### AI APIs (if configured)
- [ ] OpenAI connection works
- [ ] Anthropic connection works

## Performance Checks
- [ ] Landing page loads < 2 seconds
- [ ] VIP validation < 1 second
- [ ] No console errors
- [ ] Mobile responsive

## Final Verification
- [ ] All test scenarios pass
- [ ] No security vulnerabilities found
- [ ] Database correctly tracks all operations
- [ ] Ready for production traffic

---

✅ **If all checks pass, Cabana authentication is production-ready!**