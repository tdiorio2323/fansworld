-- Complete Messaging System Database Schema
-- This migration creates all tables needed for the messaging system

-- Conversations table - handles both direct messages and group chats
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
    title TEXT, -- For group conversations
    description TEXT, -- For group conversations
    avatar_url TEXT, -- For group conversations
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_archived BOOLEAN DEFAULT false,
    last_message_id UUID, -- Will be linked after messages table is created
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table - manages who's in each conversation
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_muted BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    last_read_message_id UUID, -- Will be linked after messages table is created
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unread_count INTEGER DEFAULT 0,
    notification_settings JSONB DEFAULT '{"all": true, "mentions": true, "paid": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per conversation
    UNIQUE(conversation_id, user_id)
);

-- Messages table - core messaging functionality
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'paid', 'tip', 'system')),
    
    -- Paid message functionality
    is_paid BOOLEAN DEFAULT false,
    price_cents INTEGER DEFAULT 0, -- Price in cents for paid messages
    currency TEXT DEFAULT 'usd',
    
    -- Message status
    status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Reply functionality
    reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    
    -- System messages
    system_message_type TEXT CHECK (system_message_type IN ('user_joined', 'user_left', 'conversation_created', 'title_changed', 'avatar_changed')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message attachments table - handles file attachments
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    
    -- File information
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- Size in bytes
    file_type TEXT NOT NULL, -- MIME type
    file_url TEXT NOT NULL, -- URL to the file in storage
    thumbnail_url TEXT, -- URL to thumbnail (for images/videos)
    
    -- File metadata
    width INTEGER, -- For images/videos
    height INTEGER, -- For images/videos
    duration INTEGER, -- For videos/audio (in seconds)
    
    -- Storage information
    storage_bucket TEXT NOT NULL DEFAULT 'message-attachments',
    storage_path TEXT NOT NULL,
    
    -- Status
    upload_status TEXT DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message payments table - tracks paid message transactions
CREATE TABLE IF NOT EXISTS message_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Payment details
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    
    -- Stripe information
    stripe_payment_intent_id TEXT,
    stripe_payment_method_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions table - likes, loves, etc.
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one reaction per user per message per type
    UNIQUE(message_id, user_id, reaction_type)
);

-- Message read receipts table - tracks who has read what
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one receipt per user per message
    UNIQUE(message_id, user_id)
);

-- User presence table - tracks online status
CREATE TABLE IF NOT EXISTS user_presence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_typing_in_conversation UUID REFERENCES conversations(id) ON DELETE SET NULL,
    typing_started_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one presence record per user
    UNIQUE(user_id)
);

-- Message reports table - for reporting inappropriate content
CREATE TABLE IF NOT EXISTS message_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'inappropriate_content', 'scam', 'other')),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now we can add the foreign key constraints that reference messages
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_last_message 
FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;

ALTER TABLE conversation_participants 
ADD CONSTRAINT fk_participants_last_read_message 
FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON conversations
    FOR SELECT USING (
        id IN (
            SELECT conversation_id 
            FROM conversation_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Participants can update conversations" ON conversations
    FOR UPDATE USING (
        id IN (
            SELECT conversation_id 
            FROM conversation_participants 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- RLS Policies for conversation_participants
CREATE POLICY "Users can view their own participation records" ON conversation_participants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view participants in their conversations" ON conversation_participants
    FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id 
            FROM conversation_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join conversations" ON conversation_participants
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation" ON conversation_participants
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id 
            FROM conversation_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT conversation_id 
            FROM conversation_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can edit their own messages" ON messages
    FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (sender_id = auth.uid());

-- RLS Policies for message_attachments
CREATE POLICY "Users can view attachments in their conversations" ON message_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT m.id 
            FROM messages m
            JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can upload attachments to their messages" ON message_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id 
            FROM messages 
            WHERE sender_id = auth.uid()
        )
    );

-- RLS Policies for message_payments
CREATE POLICY "Users can view their payment transactions" ON message_payments
    FOR SELECT USING (payer_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create payments for messages" ON message_payments
    FOR INSERT WITH CHECK (payer_id = auth.uid());

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations" ON message_reactions
    FOR SELECT USING (
        message_id IN (
            SELECT m.id 
            FROM messages m
            JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can react to messages in their conversations" ON message_reactions
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        message_id IN (
            SELECT m.id 
            FROM messages m
            JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can remove their own reactions" ON message_reactions
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for message_read_receipts
CREATE POLICY "Users can view read receipts in their conversations" ON message_read_receipts
    FOR SELECT USING (
        message_id IN (
            SELECT m.id 
            FROM messages m
            JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can mark messages as read" ON message_read_receipts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_presence
CREATE POLICY "Users can view presence of people in their conversations" ON user_presence
    FOR SELECT USING (
        user_id IN (
            SELECT cp.user_id 
            FROM conversation_participants cp
            WHERE cp.conversation_id IN (
                SELECT conversation_id 
                FROM conversation_participants 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update their own presence" ON user_presence
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for message_reports
CREATE POLICY "Users can view their own reports" ON message_reports
    FOR SELECT USING (reported_by = auth.uid());

CREATE POLICY "Users can report messages" ON message_reports
    FOR INSERT WITH CHECK (reported_by = auth.uid());

CREATE POLICY "Admins can view all reports" ON message_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_last_read_at ON conversation_participants(last_read_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_paid ON messages(is_paid);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_file_type ON message_attachments(file_type);

CREATE INDEX IF NOT EXISTS idx_message_payments_payer_id ON message_payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_message_payments_recipient_id ON message_payments(recipient_id);
CREATE INDEX IF NOT EXISTS idx_message_payments_status ON message_payments(status);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON message_read_receipts(user_id);

CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen_at ON user_presence(last_seen_at);

CREATE INDEX IF NOT EXISTS idx_message_reports_message_id ON message_reports(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reports_status ON message_reports(status);

-- Add updated_at triggers
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_participants_updated_at BEFORE UPDATE ON conversation_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_attachments_updated_at BEFORE UPDATE ON message_attachments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_payments_updated_at BEFORE UPDATE ON message_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_presence_updated_at BEFORE UPDATE ON user_presence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_reports_updated_at BEFORE UPDATE ON message_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper functions for messaging system

-- Function to create a direct conversation between two users
CREATE OR REPLACE FUNCTION create_direct_conversation(
    user1_id UUID,
    user2_id UUID
)
RETURNS UUID AS $$
DECLARE
    conversation_id UUID;
    existing_conversation UUID;
BEGIN
    -- Check if conversation already exists
    SELECT c.id INTO existing_conversation
    FROM conversations c
    WHERE c.type = 'direct'
    AND EXISTS (
        SELECT 1 FROM conversation_participants cp1 
        WHERE cp1.conversation_id = c.id AND cp1.user_id = user1_id
    )
    AND EXISTS (
        SELECT 1 FROM conversation_participants cp2 
        WHERE cp2.conversation_id = c.id AND cp2.user_id = user2_id
    );
    
    IF existing_conversation IS NOT NULL THEN
        RETURN existing_conversation;
    END IF;
    
    -- Create new conversation
    INSERT INTO conversations (type, created_by)
    VALUES ('direct', user1_id)
    RETURNING id INTO conversation_id;
    
    -- Add both users as participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES 
        (conversation_id, user1_id),
        (conversation_id, user2_id);
    
    RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
    p_conversation_id UUID,
    p_sender_id UUID,
    p_content TEXT,
    p_message_type TEXT DEFAULT 'text',
    p_reply_to UUID DEFAULT NULL,
    p_is_paid BOOLEAN DEFAULT false,
    p_price_cents INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    message_id UUID;
    participant_count INTEGER;
BEGIN
    -- Verify sender is a participant
    SELECT COUNT(*) INTO participant_count
    FROM conversation_participants
    WHERE conversation_id = p_conversation_id 
    AND user_id = p_sender_id
    AND left_at IS NULL;
    
    IF participant_count = 0 THEN
        RAISE EXCEPTION 'User is not a participant in this conversation';
    END IF;
    
    -- Create message
    INSERT INTO messages (
        conversation_id,
        sender_id,
        content,
        message_type,
        reply_to_message_id,
        is_paid,
        price_cents
    ) VALUES (
        p_conversation_id,
        p_sender_id,
        p_content,
        p_message_type,
        p_reply_to,
        p_is_paid,
        p_price_cents
    ) RETURNING id INTO message_id;
    
    -- Update conversation
    UPDATE conversations
    SET 
        last_message_id = message_id,
        last_message_at = NOW(),
        message_count = message_count + 1
    WHERE id = p_conversation_id;
    
    -- Update unread counts for all participants except sender
    UPDATE conversation_participants
    SET 
        unread_count = unread_count + 1
    WHERE conversation_id = p_conversation_id 
    AND user_id != p_sender_id
    AND left_at IS NULL;
    
    RETURN message_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_conversation_id UUID,
    p_user_id UUID,
    p_up_to_message_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    messages_marked INTEGER;
    latest_message_id UUID;
BEGIN
    -- Get latest message ID if not provided
    IF p_up_to_message_id IS NULL THEN
        SELECT id INTO latest_message_id
        FROM messages
        WHERE conversation_id = p_conversation_id
        ORDER BY sent_at DESC
        LIMIT 1;
    ELSE
        latest_message_id := p_up_to_message_id;
    END IF;
    
    -- Insert read receipts for unread messages
    INSERT INTO message_read_receipts (message_id, user_id)
    SELECT m.id, p_user_id
    FROM messages m
    WHERE m.conversation_id = p_conversation_id
    AND m.id <= latest_message_id
    AND m.sender_id != p_user_id
    AND NOT EXISTS (
        SELECT 1 FROM message_read_receipts mrr
        WHERE mrr.message_id = m.id AND mrr.user_id = p_user_id
    );
    
    GET DIAGNOSTICS messages_marked = ROW_COUNT;
    
    -- Update participant record
    UPDATE conversation_participants
    SET 
        last_read_message_id = latest_message_id,
        last_read_at = NOW(),
        unread_count = 0
    WHERE conversation_id = p_conversation_id
    AND user_id = p_user_id;
    
    RETURN messages_marked;
END;
$$ LANGUAGE plpgsql;

-- Function to update user presence
CREATE OR REPLACE FUNCTION update_user_presence(
    p_user_id UUID,
    p_status TEXT,
    p_typing_conversation_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_presence (user_id, status, is_typing_in_conversation, typing_started_at)
    VALUES (p_user_id, p_status, p_typing_conversation_id, CASE WHEN p_typing_conversation_id IS NOT NULL THEN NOW() ELSE NULL END)
    ON CONFLICT (user_id) DO UPDATE SET
        status = EXCLUDED.status,
        is_typing_in_conversation = EXCLUDED.is_typing_in_conversation,
        typing_started_at = EXCLUDED.typing_started_at,
        last_seen_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;