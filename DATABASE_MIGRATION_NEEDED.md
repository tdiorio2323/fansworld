# 🗄️ Database Migration Required

## ⚠️ IMPORTANT: Run This SQL in Your Supabase Dashboard

To complete the content moderation setup, you need to add the moderation columns to your `creator_content` table.

### 📋 **Step-by-Step Instructions:**

1. **Log into your Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run this SQL command:**

```sql
-- Add moderation columns to creator_content table
ALTER TABLE creator_content 
ADD COLUMN IF NOT EXISTS moderation_status VARCHAR DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES profiles(user_id),
ADD COLUMN IF NOT EXISTS moderation_notes TEXT;

-- Update any existing content to be approved
UPDATE creator_content 
SET moderation_status = 'approved', 
    moderated_at = NOW()
WHERE moderation_status IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_creator_content_moderation_status 
ON creator_content(moderation_status);
```

4. **Click "Run" to execute**

### ✅ **What This Does:**
- **Adds moderation fields** to your content table
- **Sets existing content** to "approved" status
- **Enables auto-approval** for all new content
- **Adds performance index** for faster queries

### 🚀 **After Running This:**
- All new content uploads will be auto-approved
- Existing content will continue to work
- Content moderation system is ready for future expansion

### 🛡️ **Content Moderation Status Options:**
- `approved` - Content is live and visible (default)
- `pending` - Content awaiting review (future use)
- `rejected` - Content rejected and hidden (future use)
- `flagged` - Content flagged for admin review (future use)

---

**✅ After running this SQL, your content moderation system will be complete!**