#!/usr/bin/env node

/**
 * Automated Sitemap Generator for Fansworld/Cabana Project
 * Generates a clean XML sitemap without escaped characters
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Configuration
const BASE_URL = 'https://cabanagrp.com';
const OUTPUT_PATH = join(process.cwd(), 'public', 'sitemap.xml');

// Define your routes here
const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/features', priority: 0.8, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  const urlset = routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
  console.log(`📊 Generated ${routes.length} URLs`);
}

// Run the generator
try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}