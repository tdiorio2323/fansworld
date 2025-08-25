#!/usr/bin/env node

/**
 * VIP Code Generator for FansWorld
 * Generates unique invitation codes for premium users
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Configuration
const CONFIG = {
  defaultCount: 100,
  codeLength: 8,
  prefix: 'VIP',
  outputDir: 'generated',
  charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
};

/**
 * Generate a formatted VIP code with prefix and checksum
 */
function generateVipCode() {
  const chars = CONFIG.charset;
  let code = CONFIG.prefix + '-';
  
  // Generate random part
  for (let i = 0; i < CONFIG.codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add checksum for validation
  const checksum = code.split('').reduce((sum, char, index) => {
    return sum + char.charCodeAt(0) * (index + 1);
  }, 0) % 10;
  
  return code + checksum;
}

/**
 * Generate a batch of unique VIP codes
 */
function generateVipCodes(count) {
  const codes = new Set();
  
  while (codes.size < count) {
    codes.add(generateVipCode());
  }
  
  return Array.from(codes).map(code => ({
    code,
    is_used: false,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    used_at: null,
    used_by: null
  }));
}

/**
 * Generate SQL for Supabase import
 */
function generateSQL(codes) {
  const timestamp = new Date().toISOString();
  let sql = `-- VIP Codes generated on ${timestamp}\n`;
  sql += `-- Total codes: ${codes.length}\n\n`;
  
  sql += `INSERT INTO invite_codes (code, is_used, created_at, expires_at) VALUES\n`;
  
  const values = codes.map(item => 
    `  ('${item.code}', ${item.is_used}, '${item.created_at}', '${item.expires_at}')`
  );
  
  sql += values.join(',\n') + ';\n';
  return sql;
}

/**
 * Validate VIP code format
 */
function validateCode(code) {
  if (!code.startsWith(CONFIG.prefix + '-')) return false;
  if (code.length !== CONFIG.prefix.length + 1 + CONFIG.codeLength + 1) return false;
  
  const mainPart = code.slice(0, -1);
  const checksum = parseInt(code.slice(-1));
  
  const calculatedChecksum = mainPart.split('').reduce((sum, char, index) => {
    return sum + char.charCodeAt(0) * (index + 1);
  }, 0) % 10;
  
  return checksum === calculatedChecksum;
}

function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || CONFIG.defaultCount;
  const format = args[1] || 'both'; // 'json', 'sql', or 'both'
  
  console.log(`🎫 Generating ${count} VIP codes...`);
  
  // Generate codes
  const vipCodes = generateVipCodes(count);
  
  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save JSON format
  if (format === 'json' || format === 'both') {
    const jsonFile = path.join(CONFIG.outputDir, `vip-codes-${timestamp}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(vipCodes, null, 2));
    console.log(`📄 JSON saved: ${jsonFile}`);
  }
  
  // Save SQL format  
  if (format === 'sql' || format === 'both') {
    const sql = generateSQL(vipCodes);
    const sqlFile = path.join(CONFIG.outputDir, `vip-codes-${timestamp}.sql`);
    fs.writeFileSync(sqlFile, sql);
    console.log(`🗃️ SQL saved: ${sqlFile}`);
  }
  
  console.log(`✅ Generated ${vipCodes.length} VIP codes`);
  console.log(`\n🔑 Sample codes:`);
  
  // Show first 5 codes with validation
  vipCodes.slice(0, 5).forEach((item, index) => {
    const isValid = validateCode(item.code) ? '✅' : '❌';
    console.log(`  ${index + 1}. ${item.code} ${isValid}`);
  });
  
  if (vipCodes.length > 5) {
    console.log(`  ... and ${vipCodes.length - 5} more`);
  }
  
  console.log(`\n💡 Usage examples:`);
  console.log(`  npm run generate:vip-codes              # Generate 100 codes`);
  console.log(`  npm run generate:vip-codes 50           # Generate 50 codes`);
  console.log(`  npm run generate:vip-codes 200 sql      # Generate 200 codes, SQL only`);
  console.log(`  npm run generate:vip-codes 75 json      # Generate 75 codes, JSON only`);
  
  console.log(`\n🚀 Ready for Supabase import!`);
}

main();