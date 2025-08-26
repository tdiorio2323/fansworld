-- 📚 STORIES & HIGHLIGHTS DATABASE MIGRATION
-- Creates all tables, functions, triggers, and views for the Stories & Highlights system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title varchar(200) NOT NULL,
  content jsonb NOT NULL DEFAULT '[]',
  thumbnail_url text,
  highlight_id uuid REFERENCES highlights(id) ON DELETE SET NULL,
  
  -- Visibility and access
  is_public boolean DEFAULT true,
  requires_subscription boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  premium_price integer, -- in cents
  
  -- Engagement counters
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  
  -- Timing
  expires_at timestamptz,
  
  -- Metadata
  tags text[] DEFAULT '{}',
  location text,
  mood text CHECK (mood IN ('happy', 'excited', 'sexy', 'flirty', 'mysterious', 'playful')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title varchar(100) NOT NULL,
  description text,
  cover_url text,
  cover_story_id uuid REFERENCES stories(id) ON DELETE SET NULL,
  
  -- Content
  story_ids uuid[] DEFAULT '{}',
  story_count integer DEFAULT 0,
  
  -- Settings
  is_public boolean DEFAULT true,
  requires_subscription boolean DEFAULT false,
  "order" integer DEFAULT 0,
  
  -- Stats
  view_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Story views tracking
CREATE TABLE IF NOT EXISTS story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  completed_percentage integer DEFAULT 100 CHECK (completed_percentage >= 0 AND completed_percentage <= 100),
  interacted boolean DEFAULT false,
  
  UNIQUE(story_id, viewer_id)
);

-- Story likes
CREATE TABLE IF NOT EXISTS story_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(story_id, user_id)
);

-- Story comments
CREATE TABLE IF NOT EXISTS story_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Story poll votes
CREATE TABLE IF NOT EXISTS story_poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  content_index integer NOT NULL,
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(story_id, content_index, voter_id)
);

-- Story question responses
CREATE TABLE IF NOT EXISTS story_question_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  content_index integer NOT NULL,
  responder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint after highlights table is created
ALTER TABLE stories ADD CONSTRAINT fk_stories_highlight 
  FOREIGN KEY (highlight_id) REFERENCES highlights(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_creator_id ON stories(creator_id);
CREATE INDEX IF NOT EXISTS idx_stories_is_public ON stories(is_public);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_view_count ON stories(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_stories_tags ON stories USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_highlights_creator_id ON highlights(creator_id);
CREATE INDEX IF NOT EXISTS idx_highlights_order ON highlights("order");
CREATE INDEX IF NOT EXISTS idx_highlights_is_public ON highlights(is_public);

CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewer_id ON story_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewed_at ON story_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_created_at ON story_comments(created_at DESC);

-- Row Level Security (RLS) Policies

-- Stories RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public stories are viewable by everyone" ON stories
  FOR SELECT USING (is_public = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Private stories are viewable by creator and subscribers" ON stories
  FOR SELECT USING (
    creator_id = auth.uid() OR
    (is_public = false AND EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE subscriber_id = auth.uid() 
      AND creator_id = stories.creator_id 
      AND status = 'active'
    ))
  );

CREATE POLICY "Creators can create their own stories" ON stories
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their own stories" ON stories
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their own stories" ON stories
  FOR DELETE USING (creator_id = auth.uid());

-- Highlights RLS
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public highlights are viewable by everyone" ON highlights
  FOR SELECT USING (is_public = true);

CREATE POLICY "Private highlights are viewable by creator and subscribers" ON highlights
  FOR SELECT USING (
    creator_id = auth.uid() OR
    (is_public = false AND EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE subscriber_id = auth.uid() 
      AND creator_id = highlights.creator_id 
      AND status = 'active'
    ))
  );

CREATE POLICY "Creators can manage their own highlights" ON highlights
  FOR ALL USING (creator_id = auth.uid());

-- Story views RLS
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own story views" ON story_views
  FOR SELECT USING (viewer_id = auth.uid());

CREATE POLICY "Creators can see views on their stories" ON story_views
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stories WHERE id = story_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can create story views" ON story_views
  FOR INSERT WITH CHECK (viewer_id = auth.uid());

-- Story likes RLS
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story likes are viewable by everyone" ON story_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like stories" ON story_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike their own likes" ON story_likes
  FOR DELETE USING (user_id = auth.uid());

-- Story comments RLS
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story comments are viewable by everyone" ON story_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment on stories" ON story_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON story_comments
  FOR DELETE USING (user_id = auth.uid());

-- Story poll votes RLS
ALTER TABLE story_poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Poll votes are viewable by story creator" ON story_poll_votes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stories WHERE id = story_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can vote on polls" ON story_poll_votes
  FOR INSERT WITH CHECK (voter_id = auth.uid());

CREATE POLICY "Users can update their poll votes" ON story_poll_votes
  FOR UPDATE USING (voter_id = auth.uid());

-- Story question responses RLS
ALTER TABLE story_question_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Question responses are viewable by story creator" ON story_question_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stories WHERE id = story_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can respond to questions" ON story_question_responses
  FOR INSERT WITH CHECK (responder_id = auth.uid());

-- Utility Functions

-- Function to increment story views
CREATE OR REPLACE FUNCTION increment_story_views(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories SET view_count = view_count + 1 WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment story likes
CREATE OR REPLACE FUNCTION increment_story_likes(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories SET like_count = like_count + 1 WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement story likes
CREATE OR REPLACE FUNCTION decrement_story_likes(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories SET like_count = GREATEST(0, like_count - 1) WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment story comments
CREATE OR REPLACE FUNCTION increment_story_comments(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories SET comment_count = comment_count + 1 WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup expired stories function
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  DELETE FROM stories WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stories_updated_at 
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_highlights_updated_at 
  BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics Views

-- Story stats view for creators
CREATE OR REPLACE VIEW story_stats_view AS
SELECT 
  s.creator_id,
  COUNT(s.id) as total_stories,
  COALESCE(SUM(s.view_count), 0) as total_views,
  COALESCE(SUM(s.like_count), 0) as total_likes,
  COALESCE(SUM(s.comment_count), 0) as total_comments,
  COALESCE(AVG(sv.completed_percentage), 0) as completion_rate,
  CASE 
    WHEN SUM(s.view_count) > 0 
    THEN (COALESCE(SUM(s.like_count), 0) + COALESCE(SUM(s.comment_count), 0)) * 100.0 / SUM(s.view_count)
    ELSE 0 
  END as engagement_rate,
  COALESCE(SUM(CASE WHEN s.is_premium THEN s.view_count * s.premium_price ELSE 0 END), 0) as premium_revenue,
  60 as average_view_duration -- Placeholder
FROM stories s
LEFT JOIN story_views sv ON s.id = sv.story_id
WHERE s.expires_at > now() OR s.expires_at IS NULL
GROUP BY s.creator_id;

-- Individual story analytics view
CREATE OR REPLACE VIEW story_analytics_view AS
SELECT 
  s.id as story_id,
  s.view_count as views,
  COUNT(DISTINCT sv.viewer_id) as unique_views,
  s.like_count as likes,
  s.comment_count as comments,
  s.share_count as shares,
  COALESCE(AVG(sv.completed_percentage), 0) as completion_rate,
  60 as average_watch_time, -- Placeholder
  CASE 
    WHEN s.view_count > 0 
    THEN (s.like_count + s.comment_count) * 100.0 / s.view_count
    ELSE 0 
  END as engagement_rate,
  CASE 
    WHEN s.is_premium 
    THEN s.view_count * s.premium_price
    ELSE 0 
  END as revenue
FROM stories s
LEFT JOIN story_views sv ON s.id = sv.story_id
GROUP BY s.id, s.view_count, s.like_count, s.comment_count, s.share_count, s.is_premium, s.premium_price;

-- Schedule cleanup of expired stories (run daily)
-- This would be set up as a cron job or scheduled function in production
-- SELECT cron.schedule('cleanup-expired-stories', '0 2 * * *', 'SELECT cleanup_expired_stories();');

-- Grant permissions
GRANT ALL ON stories TO authenticated;
GRANT ALL ON highlights TO authenticated;
GRANT ALL ON story_views TO authenticated;
GRANT ALL ON story_likes TO authenticated;
GRANT ALL ON story_comments TO authenticated;
GRANT ALL ON story_poll_votes TO authenticated;
GRANT ALL ON story_question_responses TO authenticated;

GRANT SELECT ON story_stats_view TO authenticated;
GRANT SELECT ON story_analytics_view TO authenticated;

GRANT EXECUTE ON FUNCTION increment_story_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_story_likes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_story_likes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_story_comments(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_stories() TO authenticated;

-- Sample data for testing (optional)
/*
INSERT INTO stories (creator_id, title, content, is_public, tags, mood) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Behind the Scenes',
  '[
    {
      "type": "text",
      "text": "Getting ready for today''s shoot! 💄✨",
      "duration": 5,
      "order": 0,
      "backgroundColor": "#FF6B9D",
      "textColor": "#FFFFFF",
      "fontSize": "large",
      "textAlign": "center"
    }
  ]',
  true,
  ARRAY['behind-scenes', 'makeup', 'photoshoot'],
  'excited'
);

INSERT INTO highlights (creator_id, title, description, is_public) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Behind the Scenes',
  'Exclusive behind-the-scenes content from my shoots',
  true
);
*/

-- Rollback instructions (commented out):
/*
-- To remove all Stories & Highlights tables and data:
DROP VIEW IF EXISTS story_analytics_view;
DROP VIEW IF EXISTS story_stats_view;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_stories();
DROP FUNCTION IF EXISTS increment_story_comments(uuid);
DROP FUNCTION IF EXISTS decrement_story_likes(uuid);
DROP FUNCTION IF EXISTS increment_story_likes(uuid);
DROP FUNCTION IF EXISTS increment_story_views(uuid);
DROP TABLE IF EXISTS story_question_responses;
DROP TABLE IF EXISTS story_poll_votes;
DROP TABLE IF EXISTS story_comments;
DROP TABLE IF EXISTS story_likes;
DROP TABLE IF EXISTS story_views;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS highlights;
*/