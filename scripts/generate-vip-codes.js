#!/usr/bin/env node

/**
 * VIP Code Generator for Fansworld
 * 
 * This script generates VIP invite codes for the platform
 * Usage: node scripts/generate-vip-codes.js
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  console.log('💡 Add SUPABASE_SERVICE_KEY to your .env.local file (get it from Supabase dashboard)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// VIP Code Templates
const VIP_CODE_TYPES = {
  creator: {
    prefix: 'CREATOR',
    expiry_days: 30,
    description: 'Creator early access'
  },
  influencer: {
    prefix: 'INFLUX',
    expiry_days: 14,
    description: 'Influencer invitation'
  },
  vip: {
    prefix: 'VIP',
    expiry_days: 7,
    description: 'VIP access'
  },
  partner: {
    prefix: 'PARTNER',
    expiry_days: 90,
    description: 'Strategic partner access'
  },
  launch: {
    prefix: 'LAUNCH',
    expiry_days: 3,
    description: 'Launch day special'
  }
};

/**
 * Generate a random alphanumeric string
 */
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a single VIP code
 */
function generateVipCode(type) {
  const template = VIP_CODE_TYPES[type];
  const randomPart = generateRandomString(6);
  return `${template.prefix}-${randomPart}`;
}

/**
 * Create VIP codes in database
 */
async function createVipCodes(type, count) {
  const template = VIP_CODE_TYPES[type];
  const codes = [];
  
  console.log(`\n🎫 Generating ${count} ${type} codes...`);
  
  for (let i = 0; i < count; i++) {
    const code = generateVipCode(type);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + template.expiry_days);
    
    codes.push({
      code,
      invite_type: type,
      expires_at: expiresAt.toISOString(),
      used: false,
      metadata: {
        description: template.description,
        generated_at: new Date().toISOString(),
        generated_by: 'system'
      }
    });
  }
  
  // Insert codes into database
  const { data, error } = await supabase
    .from('invites')
    .insert(codes)
    .select();
  
  if (error) {
    console.error('❌ Error creating codes:', error.message);
    return [];
  }
  
  console.log(`✅ Successfully created ${data.length} ${type} codes`);
  return data;
}

/**
 * Display generated codes
 */
function displayCodes(codesByType) {
  console.log('\n📋 Generated VIP Codes Summary:');
  console.log('================================\n');
  
  for (const [type, codes] of Object.entries(codesByType)) {
    if (codes.length > 0) {
      console.log(`${type.toUpperCase()} CODES (${codes.length}):`);
      console.log('-------------------');
      codes.forEach(code => {
        const expiryDate = new Date(code.expires_at).toLocaleDateString();
        console.log(`  ${code.code} - Expires: ${expiryDate}`);
      });
      console.log('');
    }
  }
}

/**
 * Generate sample marketing links
 */
function generateMarketingLinks(codes) {
  console.log('\n🔗 Sample Marketing Links:');
  console.log('=========================\n');
  
  const baseUrl = 'https://cabana.tdstudiosny.com/coming-soon';
  
  // Show 3 sample links from each type
  for (const [type, codeList] of Object.entries(codes)) {
    if (codeList.length > 0) {
      console.log(`${type.toUpperCase()} CAMPAIGN LINKS:`);
      const samples = codeList.slice(0, 3);
      samples.forEach(code => {
        console.log(`  ${baseUrl}?vip=${code.code}`);
      });
      console.log('');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Fansworld VIP Code Generator');
  console.log('===============================');
  
  // Check if invites table exists
  const { error: tableError } = await supabase
    .from('invites')
    .select('count')
    .limit(1);
  
  if (tableError) {
    console.error('❌ Error: invites table not found. Please run database migrations first.');
    process.exit(1);
  }
  
  // Generate codes for each type
  const generatedCodes = {};
  
  // Initial launch codes
  generatedCodes.creator = await createVipCodes('creator', 10);
  generatedCodes.influencer = await createVipCodes('influencer', 20);
  generatedCodes.vip = await createVipCodes('vip', 50);
  generatedCodes.partner = await createVipCodes('partner', 5);
  generatedCodes.launch = await createVipCodes('launch', 100);
  
  // Display summary
  displayCodes(generatedCodes);
  
  // Generate sample marketing links
  generateMarketingLinks(generatedCodes);
  
  // Stats
  const totalCodes = Object.values(generatedCodes).reduce((sum, codes) => sum + codes.length, 0);
  console.log(`\n📊 Total codes generated: ${totalCodes}`);
  console.log('\n✨ VIP codes generated successfully!');
  console.log('💡 Share these codes with your marketing team and creators');
}

// Run the script
main().catch(console.error);