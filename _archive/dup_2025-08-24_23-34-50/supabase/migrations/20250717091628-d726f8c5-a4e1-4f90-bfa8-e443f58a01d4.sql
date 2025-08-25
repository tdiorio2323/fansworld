-- Make the newly created user an admin for testing
UPDATE profiles 
SET is_admin = true 
WHERE user_id = '87f62b16-1b28-4b9d-8e0a-4dee25e33259';