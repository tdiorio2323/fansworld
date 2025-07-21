-- First, let's see all users in the profiles table
SELECT id, email, username, role, is_admin 
FROM profiles
LIMIT 10;

-- Once you find your user, update them to admin
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles
SET role = 'admin',
    is_admin = true
WHERE email = '!!!-REPLACE-WITH-YOUR-EMAIL-!!!';

-- Or if you're the first/only user, you can update by ID
-- UPDATE profiles 
-- SET role = 'admin', 
--     is_admin = true
-- WHERE id = (SELECT id FROM profiles LIMIT 1);

-- Verify the update worked
SELECT id, email, username, role, is_admin 
FROM profiles 
WHERE role = 'admin';