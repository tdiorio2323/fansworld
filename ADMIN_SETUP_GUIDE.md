# 🔐 Admin Setup Guide for Fansworld

## Current Issue
Your user role is set to "authenticated" (default) instead of "admin".

## Quick Fix - Update Your Role to Admin

### Option 1: Direct Database Update (Easiest)

1. **In Supabase Dashboard:**
   - Go to Table Editor → `profiles` table
   - Find your user row
   - Click the edit button (pencil icon)
   - Change the `role` field from `authenticated` to `admin`
   - Also set `is_admin` to `true` if that column exists
   - Click Save

### Option 2: SQL Query

Run this in the Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin', 
    is_admin = true
WHERE email = 'your-email@example.com';
```

Or if you know your user ID:

```sql
-- Replace 'your-user-id' with your actual user ID
UPDATE profiles 
SET role = 'admin', 
    is_admin = true
WHERE user_id = 'your-user-id';
```

### Option 3: Create Admin Setup Function

Run this SQL to create a function that makes any email an admin:

```sql
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin', 
      is_admin = true
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then use it:
SELECT make_user_admin('your-email@example.com');
```

## Verify Admin Access

After updating your role:

1. **Refresh your browser** or log out and back in
2. Navigate to `/admin`
3. You should now have access to the admin dashboard

## Understanding Roles in Fansworld

- **authenticated**: Default role for all logged-in users
- **admin**: Full platform administration access
- **creator**: Content creator role
- **user/fan**: Regular user role

## Troubleshooting

If you still can't access admin after updating:

1. **Check the profiles table** - Ensure role = 'admin'
2. **Clear browser cache** and cookies
3. **Log out and log back in**
4. **Check browser console** for errors

## Security Note

Only give admin access to trusted users. Admin users can:
- View all user data
- Manage creator applications
- Process payouts
- Access analytics
- Modify platform settings

---

**Remember:** The "authenticated" role you see in the screenshot is just the Supabase Auth default. You need to update the role in the `profiles` table to "admin".