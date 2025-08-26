#!/usr/bin/env node

/**
 * CABANA Production Verification Script
 * Validates all routes, assets, and functionality in production
 */

import https from 'https';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_URL = 'https://cabanagrp.com';
const TIMEOUT = 10000;

// All routes that should be accessible
const ROUTES_TO_TEST = [
  '/',
  '/about',
  '/features',
  '/pricing',
  '/signin',
  '/register',
  '/discover',
  '/feed',
  '/agency',
  '/analytics',
  '/subscription-plans',
  '/landing',
  '/vip',
  '/help',
  '/terms',
  '/forum',
  '/ui-demo',
  '/luxury-demo',
  '/creator-application',
  '/referrals',
  '/test',
  '/SimpleVipEntry',
  '/payment-success',
  '/creator/dashboard',
  '/creator/analytics',
  '/creator/tools',
  '/creator/content',
  '/creator/earnings',
  '/creator/fans',
  '/invalid-route-test-404'
];

// Critical assets to verify
const ASSETS_TO_TEST = [
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/logo192.png',
  '/favicon.ico',
  '/cabana-crystal-bg.jpg'
];

// SEO requirements
const SEO_REQUIREMENTS = [
  { tag: 'meta[name="description"]', required: true },
  { tag: 'meta[property="og:title"]', required: true },
  { tag: 'meta[property="og:description"]', required: true },
  { tag: 'meta[property="og:image"]', required: true },
  { tag: 'meta[name="twitter:card"]', required: true },
  { tag: 'link[rel="canonical"]', required: true },
  { tag: 'meta[name="theme-color"]', required: true }
];

// Security headers to verify
const SECURITY_HEADERS = [
  'x-content-type-options',
  'x-frame-options',
  'x-xss-protection',
  'referrer-policy',
  'permissions-policy'
];

class ProductionVerifier {
  constructor() {
    this.results = {
      routes: { passed: [], failed: [] },
      assets: { passed: [], failed: [] },
      seo: { passed: [], failed: [] },
      security: { passed: [], failed: [] },
      performance: {},
      errors: []
    };
  }

  async testUrl(url, type = 'route') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      https.get(url, { timeout: TIMEOUT }, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        
        res.on('end', () => {
          const duration = Date.now() - startTime;
          const success = res.statusCode === 200 || 
                         (type === 'route' && res.statusCode === 304);
          
          resolve({
            url,
            statusCode: res.statusCode,
            success,
            duration,
            headers: res.headers,
            contentLength: data.length,
            data: type === 'route' ? data : null
          });
        });
      }).on('error', (err) => {
        resolve({
          url,
          success: false,
          error: err.message,
          duration: Date.now() - startTime
        });
      }).on('timeout', () => {
        resolve({
          url,
          success: false,
          error: 'Timeout',
          duration: TIMEOUT
        });
      });
    });
  }

  async testRoutes() {
    console.log('\\n📍 Testing Routes...');
    
    for (const route of ROUTES_TO_TEST) {
      const url = `${PRODUCTION_URL}${route}`;
      const result = await this.testUrl(url, 'route');
      
      if (result.success) {
        // Check if it's actually returning the SPA content
        const hasReactRoot = result.data && result.data.includes('id="root"');
        if (hasReactRoot || route === '/invalid-route-test-404') {
          this.results.routes.passed.push({
            route,
            statusCode: result.statusCode,
            duration: result.duration
          });
          console.log(`  ✅ ${route} (${result.duration}ms)`);
        } else {
          this.results.routes.failed.push({
            route,
            reason: 'No React root element found',
            statusCode: result.statusCode
          });
          console.log(`  ❌ ${route} - No React app detected`);
        }
      } else {
        this.results.routes.failed.push({
          route,
          error: result.error || `Status ${result.statusCode}`,
          statusCode: result.statusCode
        });
        console.log(`  ❌ ${route} - ${result.error || `Status ${result.statusCode}`}`);
      }
    }
  }

  async testAssets() {
    console.log('\\n📦 Testing Static Assets...');
    
    for (const asset of ASSETS_TO_TEST) {
      const url = `${PRODUCTION_URL}${asset}`;
      const result = await this.testUrl(url, 'asset');
      
      if (result.success) {
        this.results.assets.passed.push({
          asset,
          size: result.contentLength,
          duration: result.duration
        });
        console.log(`  ✅ ${asset} (${result.contentLength} bytes)`);
      } else {
        this.results.assets.failed.push({
          asset,
          error: result.error || `Status ${result.statusCode}`
        });
        console.log(`  ❌ ${asset} - ${result.error || `Status ${result.statusCode}`}`);
      }
    }
  }

  async testSEO() {
    console.log('\\n🔍 Testing SEO Configuration...');
    
    const result = await this.testUrl(PRODUCTION_URL, 'route');
    
    if (result.success && result.data) {
      for (const req of SEO_REQUIREMENTS) {
        const regex = new RegExp(`<${req.tag.replace('[', '\\\\[').replace(']', '\\\\]')}[^>]*>`, 'i');
        const found = regex.test(result.data);
        
        if (found) {
          this.results.seo.passed.push(req.tag);
          console.log(`  ✅ ${req.tag}`);
        } else {
          this.results.seo.failed.push(req.tag);
          console.log(`  ❌ ${req.tag} - Missing`);
        }
      }
    } else {
      this.results.errors.push('Could not fetch homepage for SEO testing');
    }
  }

  async testSecurity() {
    console.log('\\n🔒 Testing Security Headers...');
    
    const result = await this.testUrl(PRODUCTION_URL, 'route');
    
    if (result.success && result.headers) {
      for (const header of SECURITY_HEADERS) {
        if (result.headers[header]) {
          this.results.security.passed.push({
            header,
            value: result.headers[header]
          });
          console.log(`  ✅ ${header}: ${result.headers[header]}`);
        } else {
          this.results.security.failed.push(header);
          console.log(`  ❌ ${header} - Missing`);
        }
      }
    } else {
      this.results.errors.push('Could not fetch headers for security testing');
    }
  }

  async testPerformance() {
    console.log('\\n⚡ Testing Performance...');
    
    const criticalRoutes = ['/', '/discover', '/pricing'];
    const timings = [];
    
    for (const route of criticalRoutes) {
      const url = `${PRODUCTION_URL}${route}`;
      const result = await this.testUrl(url, 'route');
      
      if (result.success) {
        timings.push({
          route,
          duration: result.duration
        });
        console.log(`  📊 ${route}: ${result.duration}ms`);
      }
    }
    
    const avgTime = timings.reduce((acc, t) => acc + t.duration, 0) / timings.length;
    this.results.performance = {
      averageLoadTime: Math.round(avgTime),
      routes: timings,
      acceptable: avgTime < 3000
    };
    
    console.log(`\\n  Average load time: ${Math.round(avgTime)}ms ${avgTime < 3000 ? '✅' : '⚠️'}`);
  }

  generateReport() {
    console.log('\\n' + '='.repeat(60));
    console.log('📊 PRODUCTION VERIFICATION REPORT');
    console.log('='.repeat(60));
    console.log(`URL: ${PRODUCTION_URL}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    
    // Routes Summary
    console.log('\\n🚀 Routes:');
    console.log(`  ✅ Passed: ${this.results.routes.passed.length}/${ROUTES_TO_TEST.length}`);
    console.log(`  ❌ Failed: ${this.results.routes.failed.length}/${ROUTES_TO_TEST.length}`);
    
    if (this.results.routes.failed.length > 0) {
      console.log('\\n  Failed routes:');
      this.results.routes.failed.forEach(r => {
        console.log(`    - ${r.route}: ${r.error || r.reason}`);
      });
    }
    
    // Assets Summary
    console.log('\\n📦 Static Assets:');
    console.log(`  ✅ Passed: ${this.results.assets.passed.length}/${ASSETS_TO_TEST.length}`);
    console.log(`  ❌ Failed: ${this.results.assets.failed.length}/${ASSETS_TO_TEST.length}`);
    
    if (this.results.assets.failed.length > 0) {
      console.log('\\n  Failed assets:');
      this.results.assets.failed.forEach(a => {
        console.log(`    - ${a.asset}: ${a.error}`);
      });
    }
    
    // SEO Summary
    console.log('\\n🔍 SEO:');
    console.log(`  ✅ Passed: ${this.results.seo.passed.length}/${SEO_REQUIREMENTS.length}`);
    console.log(`  ❌ Failed: ${this.results.seo.failed.length}/${SEO_REQUIREMENTS.length}`);
    
    // Security Summary
    console.log('\\n🔒 Security:');
    console.log(`  ✅ Headers present: ${this.results.security.passed.length}/${SECURITY_HEADERS.length}`);
    console.log(`  ❌ Headers missing: ${this.results.security.failed.length}/${SECURITY_HEADERS.length}`);
    
    // Performance Summary
    console.log('\\n⚡ Performance:');
    console.log(`  Average load time: ${this.results.performance.averageLoadTime}ms`);
    console.log(`  Status: ${this.results.performance.acceptable ? '✅ Acceptable' : '⚠️ Needs optimization'}`);
    
    // Overall Status
    const allRoutesPassed = this.results.routes.failed.length === 0;
    const allAssetsPassed = this.results.assets.failed.length === 0;
    const seoAcceptable = this.results.seo.failed.length <= 2;
    const securityAcceptable = this.results.security.failed.length <= 2;
    const performanceAcceptable = this.results.performance.acceptable;
    
    const overallSuccess = allRoutesPassed && allAssetsPassed && seoAcceptable && 
                          securityAcceptable && performanceAcceptable;
    
    console.log('\\n' + '='.repeat(60));
    console.log('OVERALL STATUS: ' + (overallSuccess ? '✅ PRODUCTION READY' : '❌ ISSUES DETECTED'));
    console.log('='.repeat(60));
    
    // Save report to file
    return this.saveReport();
  }

  async saveReport() {
    const reportPath = path.join(__dirname, '..', 'reports', 'production-verification.json');
    const reportDir = path.dirname(reportPath);
    
    try {
      await fs.mkdir(reportDir, { recursive: true });
      await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`\\n📁 Report saved to: ${reportPath}`);
    } catch (error) {
      console.error('Failed to save report:', error.message);
    }
    
    return this.results;
  }

  async run() {
    console.log('🚀 Starting CABANA Production Verification...');
    console.log('='.repeat(60));
    
    await this.testRoutes();
    await this.testAssets();
    await this.testSEO();
    await this.testSecurity();
    await this.testPerformance();
    
    return this.generateReport();
  }
}

// Run verification
const verifier = new ProductionVerifier();
verifier.run().then(results => {
  process.exit(results.routes.failed.length === 0 ? 0 : 1);
}).catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});