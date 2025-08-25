// Simple HTTP-based Supabase SQL execution
const https = require('https');

const SQL_COMMANDS = [
  // Core table creation
  `CREATE TABLE IF NOT EXISTS creator_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    location TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    instagram_handle TEXT,
    tiktok_handle TEXT,
    onlyfans_handle TEXT,
    twitch_handle TEXT,
    youtube_handle TEXT,
    total_followers INTEGER NOT NULL,
    monthly_earnings INTEGER NOT NULL,
    content_niche TEXT NOT NULL,
    career_goals TEXT NOT NULL,
    current_challenges TEXT NOT NULL,
    previous_management TEXT NOT NULL,
    interested_package TEXT NOT NULL,
    over_18 BOOLEAN NOT NULL DEFAULT false,
    agrees_to_terms BOOLEAN NOT NULL DEFAULT false,
    agrees_to_background BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE TABLE IF NOT EXISTS creator_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gross_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    platform_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    payout_status TEXT NOT NULL DEFAULT 'pending',
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'active',
    plan_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE TABLE IF NOT EXISTS content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL,
    file_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`
];

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'dotfloiygvhsujlwzqgv.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGZsb2l5Z3Zoc3VqbHd6cWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA5NDg3NSwiZXhwIjoyMDY4NjcwODc1fQ._h0D0P7oqsUlzPJkCv2ebKYSrJLjI9Bg_4khjRvYysw',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGZsb2l5Z3Zoc3VqbHd6cWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQ4NzUsImV4cCI6MjA2ODY3MDg3NX0.pMqR9o0kRT6NI3EEDFEbq339ZWWUfijNjoPBN-lf6a0',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        console.log('Response:', response);
        resolve(response);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function setupDatabase() {
  console.log('🚀 Setting up CABANA database schema...');
  
  for (let i = 0; i < SQL_COMMANDS.length; i++) {
    const sql = SQL_COMMANDS[i];
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
    
    try {
      console.log(`📄 Creating table: ${tableName}...`);
      await executeSQL(sql);
      console.log(`✅ ${tableName} created successfully`);
    } catch (error) {
      console.log(`❌ Failed to create ${tableName}:`, error.message);
    }
  }
  
  console.log('\\n🎉 Database setup complete!');
}

setupDatabase().catch(console.error);