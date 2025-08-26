-- Fix the admin RLS policy to use the is_admin boolean column instead of role
DROP POLICY IF EXISTS "Admins can manage all invites" ON public.invites;

-- Create corrected admin policy for invites table
CREATE POLICY "Admins can manage all invites" ON public.invites
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Ensure is_admin column has proper default
ALTER TABLE public.profiles ALTER COLUMN is_admin SET DEFAULT false;