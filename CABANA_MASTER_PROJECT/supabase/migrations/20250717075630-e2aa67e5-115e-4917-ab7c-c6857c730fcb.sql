-- Make current user admin using the is_admin boolean column (consistent with new RLS policies)
UPDATE profiles 
SET is_admin = true 
WHERE user_id = auth.uid();