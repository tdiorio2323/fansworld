// Apply Link Tracking Migration to Supabase
// Run this script with: node apply-migration.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Get your Supabase URL and key from environment or hardcode temporarily
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydrlcunmhcgmbxpsztbo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('🚀 Starting migration...');
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250718120000-link-tracking-system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} completed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('🎉 Migration completed!');
    console.log('\n📊 You can now:');
    console.log('- Visit /analytics for the dashboard');
    console.log('- Create tracked links');
    console.log('- Monitor VIP code distribution');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

// Alternative function to test basic connectivity
async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('waitlist').select('count(*)');
    
    if (error) {
      console.error('❌ Connection test failed:', error);
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Current waitlist entries:', data);
    }
  } catch (err) {
    console.error('💥 Connection error:', err);
  }
}

// Run migration
if (process.argv[2] === 'test') {
  testConnection();
} else {
  applyMigration();
}