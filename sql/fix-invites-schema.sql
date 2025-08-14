-- Fix Invites Table Schema
-- This script ensures the invites table uses the correct schema expected by the application

-- First, check if the table exists and what columns it has
-- Run this query in Supabase SQL Editor to see current schema:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invites';

-- If the table has 'code' instead of 'invite_code', run this migration:
DO $$ 
BEGIN
    -- Check if 'code' column exists and 'invite_code' doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'code'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'invite_code'
    ) THEN
        -- Rename 'code' to 'invite_code'
        ALTER TABLE invites RENAME COLUMN code TO invite_code;
    END IF;

    -- Check if 'used' column exists and 'status' doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'used'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'status'
    ) THEN
        -- Add status column
        ALTER TABLE invites ADD COLUMN status TEXT DEFAULT 'active';
        
        -- Update status based on 'used' boolean
        UPDATE invites SET status = 'used' WHERE used = true;
        UPDATE invites SET status = 'active' WHERE used = false;
        
        -- Drop the old 'used' column
        ALTER TABLE invites DROP COLUMN used;
    END IF;

    -- Ensure passcode column exists (required by the app)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'passcode'
    ) THEN
        ALTER TABLE invites ADD COLUMN passcode TEXT DEFAULT substring(gen_random_uuid()::text, 1, 10);
    END IF;

    -- Ensure other required columns exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'max_uses'
    ) THEN
        ALTER TABLE invites ADD COLUMN max_uses INTEGER DEFAULT 1;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invites' AND column_name = 'current_uses'
    ) THEN
        ALTER TABLE invites ADD COLUMN current_uses INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add constraints if they don't exist
ALTER TABLE invites DROP CONSTRAINT IF EXISTS invites_invite_code_unique;
ALTER TABLE invites ADD CONSTRAINT invites_invite_code_unique UNIQUE (invite_code);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_invites_invite_code ON invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_invites_status ON invites(status);

-- Verify the schema after migration
-- Run this to confirm:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invites' ORDER BY ordinal_position;