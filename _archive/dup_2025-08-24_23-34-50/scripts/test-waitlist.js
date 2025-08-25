#!/usr/bin/env node

/**
 * Waitlist Testing Script for Fansworld
 * 
 * This script tests the waitlist signup flow
 * Usage: node scripts/test-waitlist.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data
const testEmails = [
  'test1@example.com',
  'creator.test@example.com',
  'influencer.test@example.com'
];

const testSources = ['direct', 'instagram', 'twitter', 'email_campaign'];

/**
 * Test waitlist signup
 */
async function testWaitlistSignup(email, source = 'test_script') {
  console.log(`\n📧 Testing signup for: ${email}`);
  
  // Check if email already exists
  const { data: existing } = await supabase
    .from('waitlist')
    .select('*')
    .eq('email', email)
    .single();
  
  if (existing) {
    console.log(`⚠️  Email already in waitlist: ${email}`);
    return existing;
  }
  
  // Sign up for waitlist
  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      email,
      source,
      metadata: {
        test: true,
        user_agent: 'Test Script',
        timestamp: new Date().toISOString()
      }
    })
    .select()
    .single();
  
  if (error) {
    console.error(`❌ Error signing up ${email}:`, error.message);
    return null;
  }
  
  console.log(`✅ Successfully signed up: ${email}`);
  return data;
}

/**
 * Test VIP code validation
 */
async function testVipCodeValidation(code) {
  console.log(`\n🎫 Testing VIP code: ${code}`);
  
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gte('expires_at', new Date().toISOString())
    .single();
  
  if (error || !data) {
    console.log(`❌ Invalid or expired code: ${code}`);
    return false;
  }
  
  console.log(`✅ Valid code: ${code}`);
  console.log(`   Type: ${data.invite_type}`);
  console.log(`   Expires: ${new Date(data.expires_at).toLocaleDateString()}`);
  return true;
}

/**
 * Test waitlist statistics
 */
async function getWaitlistStats() {
  console.log('\n📊 Waitlist Statistics:');
  console.log('======================');
  
  // Total signups
  const { count: totalCount } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total signups: ${totalCount || 0}`);
  
  // Signups by source
  const { data: sources } = await supabase
    .from('waitlist')
    .select('source');
  
  if (sources) {
    const sourceCounts = sources.reduce((acc, { source }) => {
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nSignups by source:');
    Object.entries(sourceCounts).forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`);
    });
  }
  
  // Recent signups
  const { data: recent } = await supabase
    .from('waitlist')
    .select('email, created_at, source')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recent && recent.length > 0) {
    console.log('\nRecent signups:');
    recent.forEach(signup => {
      const date = new Date(signup.created_at).toLocaleString();
      console.log(`  ${signup.email} - ${date} (${signup.source})`);
    });
  }
}

/**
 * Test the coming soon page flow
 */
async function testComingSoonFlow() {
  console.log('\n🧪 Testing Coming Soon Page Flow:');
  console.log('=================================');
  
  // Test 1: Valid email signup
  console.log('\n1️⃣ Testing valid email signup...');
  const validEmail = `test-${Date.now()}@example.com`;
  const signup1 = await testWaitlistSignup(validEmail, 'direct');
  
  // Test 2: Duplicate email
  console.log('\n2️⃣ Testing duplicate email...');
  await testWaitlistSignup(validEmail, 'direct');
  
  // Test 3: Different sources
  console.log('\n3️⃣ Testing different traffic sources...');
  for (const source of testSources) {
    const email = `${source}-${Date.now()}@example.com`;
    await testWaitlistSignup(email, source);
  }
  
  // Test 4: Check for existing VIP codes
  console.log('\n4️⃣ Checking for VIP codes...');
  const { data: vipCodes } = await supabase
    .from('invites')
    .select('code')
    .eq('used', false)
    .limit(3);
  
  if (vipCodes && vipCodes.length > 0) {
    for (const { code } of vipCodes) {
      await testVipCodeValidation(code);
    }
  } else {
    console.log('⚠️  No VIP codes found. Run generate-vip-codes.js first.');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Fansworld Waitlist Testing Script');
  console.log('===================================');
  
  // Check connection
  const { error: connError } = await supabase
    .from('waitlist')
    .select('count')
    .limit(1);
  
  if (connError) {
    console.error('❌ Error connecting to database:', connError.message);
    console.log('💡 Make sure the waitlist table exists and RLS is configured');
    process.exit(1);
  }
  
  // Run tests
  await testComingSoonFlow();
  
  // Show statistics
  await getWaitlistStats();
  
  console.log('\n✅ Waitlist testing complete!');
  console.log('💡 Check the results above for any issues');
  console.log('🔗 Test the live page at: https://cabana.tdstudiosny.com/coming-soon');
}

// Run the script
main().catch(console.error);