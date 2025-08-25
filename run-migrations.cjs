const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key
const supabase = createClient(
  'https://dotfloiygvhsujlwzqgv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGZsb2l5Z3Zoc3VqbHd6cWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA5NDg3NSwiZXhwIjoyMDY4NjcwODc1fQ._h0D0P7oqsUlzPJkCv2ebKYSrJLjI9Bg_4khjRvYysw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runMigrations() {
  console.log('🚀 Starting CABANA Database Migration...');
  
  // Key migration files to run
  const migrations = [
    'database/supabase/migrations/20250718000000-td-studios-agency-schema.sql',
    'database/supabase/migrations/20250718000001-stripe-payment-integration.sql',
    'database/supabase/migrations/20250718000002-stripe-connect-integration.sql',
    'database/supabase/migrations/20250718000003-messaging-system.sql'
  ];
  
  for (const migration of migrations) {
    try {
      console.log(`\n📄 Running: ${path.basename(migration)}`);
      
      const migrationPath = path.join(__dirname, migration);
      if (!fs.existsSync(migrationPath)) {
        console.log(`⚠️  Migration file not found: ${migrationPath}`);
        continue;
      }
      
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      console.log(`   Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.length < 10) continue; // Skip very short statements
        
        try {
          // Use the raw query method
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.log(`   ❌ Statement ${i+1} failed: ${error.message}`);
            // Continue with next statement
          } else {
            process.stdout.write('.');
          }
        } catch (err) {
          console.log(`   ❌ Statement ${i+1} error: ${err.message}`);
        }
      }
      
      console.log(`\n   ✅ Migration completed: ${path.basename(migration)}`);
      
    } catch (err) {
      console.log(`❌ Failed to run ${migration}: ${err.message}`);
    }
  }
  
  console.log('\n🎉 Migration process completed!');
  console.log('\n🔍 Verifying tables...');
  
  // Verify key tables exist
  const testTables = ['creator_applications', 'subscriptions', 'messages', 'creator_earnings'];
  
  for (const table of testTables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ ${table} - ${error.message}`);
      } else {
        console.log(`✅ ${table} - EXISTS`);
      }
    } catch (e) {
      console.log(`❌ ${table} - ERROR: ${e.message}`);
    }
  }
}

// Run migrations
runMigrations().catch(console.error);