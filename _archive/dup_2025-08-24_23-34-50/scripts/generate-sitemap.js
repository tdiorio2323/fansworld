#!/usr/bin/env node
/**
 * Automated Sitemap Generation Script for Cabana/Fansworld
 * 
 * This script generates a clean XML sitemap for the application
 * Run with: node scripts/generate-sitemap.js
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗺️  Generating sitemap for Cabana...\n');

// Configuration
const config = {
  domain: 'https://cabana.tdstudiosny.com',
  routes: [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/features', priority: '0.8', changefreq: 'weekly' },
    { path: '/pricing', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' }
  ]
};

// Generate current date in YYYY-MM-DD format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Validate XML characters and escape if needed
const escapeXml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Generate sitemap XML
const generateSitemap = () => {
  const currentDate = getCurrentDate();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  config.routes.forEach(route => {
    const url = `${config.domain}${route.path}`;
    sitemap += `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
};

// Validate generated XML
const validateXml = (xml) => {
  // Check for common XML issues
  const issues = [];
  
  if (xml.includes('\\</')) {
    issues.push('Found escaped backslashes in closing tags');
  }
  
  if (xml.includes('\\<')) {
    issues.push('Found escaped backslashes in opening tags');
  }
  
  if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    issues.push('Missing XML declaration');
  }
  
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    issues.push('Missing or invalid urlset declaration');
  }
  
  return issues;
};

// Main execution
try {
  const sitemapXml = generateSitemap();
  const validationIssues = validateXml(sitemapXml);
  
  if (validationIssues.length > 0) {
    console.error('❌ Sitemap validation failed:');
    validationIssues.forEach(issue => console.error(`   • ${issue}`));
    process.exit(1);
  }
  
  // Write to public directory
  const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(publicPath, sitemapXml, 'utf8');
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📁 Location: ${publicPath}`);
  console.log(`🌐 Domain: ${config.domain}`);
  console.log(`📄 Routes included: ${config.routes.length}`);
  console.log(`📅 Last updated: ${getCurrentDate()}`);
  console.log('\n🔍 Sitemap content preview:');
  console.log(sitemapXml);
  
} catch (error) {
  console.error('❌ Error generating sitemap:', error.message);
  process.exit(1);
}

export default generateSitemap;