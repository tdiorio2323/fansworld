import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

// All routes to capture
const routes = [
  // Public Routes
  { path: '/', name: 'Homepage (SimpleVipEntry)' },
  { path: '/signin', name: 'Sign In' },
  { path: '/register', name: 'Register' },
  { path: '/discover', name: 'Discover Creators' },
  { path: '/creator/testuser', name: 'Creator Profile' },
  { path: '/agency', name: 'Agency Landing' },
  { path: '/landing', name: 'Landing Page' },
  { path: '/vip', name: 'VIP Entry' },
  { path: '/subscription-plans', name: 'Subscription Plans' },
  { path: '/feed', name: 'Public Feed' },
  
  // Protected Routes (will show login prompt or placeholder)
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/analytics', name: 'Analytics Dashboard' },
  { path: '/creator-dashboard', name: 'Creator Dashboard' },
  { path: '/content-manager', name: 'Content Manager' },
  { path: '/messages', name: 'Messages' },
  { path: '/billing', name: 'Billing' },
  { path: '/settings', name: 'Settings' },
  { path: '/referrals', name: 'Referral Program' },
  { path: '/creator-application', name: 'Creator Application' },
  { path: '/reels', name: 'Reels' },
  { path: '/payment-success', name: 'Payment Success' },
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  const screenshots = [];
  const outputDir = './screenshots';
  
  // Create screenshots directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  console.log('Starting screenshot capture...');
  
  for (const route of routes) {
    try {
      console.log(`Capturing: ${route.name} (${route.path})`);
      
      // Navigate to route
      await page.goto(`http://localhost:8080${route.path}`, { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Capture screenshot
      const filename = `${route.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const filepath = path.join(outputDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true,
        quality: 90 
      });
      
      screenshots.push({
        name: route.name,
        path: route.path,
        file: filepath
      });
      
      console.log(`✓ Captured: ${route.name}`);
      
    } catch (error) {
      console.log(`✗ Failed to capture ${route.name}: ${error.message}`);
      // Continue with next route
    }
  }
  
  await browser.close();
  return screenshots;
}

async function createPDF(screenshots) {
  console.log('Creating PDF...');
  
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50
  });
  
  doc.pipe(fs.createWriteStream('./CABANA_Frontend_Screenshots.pdf'));
  
  // Title page
  doc.fontSize(24).text('CABANA Frontend Screenshot Audit', 50, 50);
  doc.fontSize(14).text(`Generated: ${new Date().toLocaleDateString()}`, 50, 80);
  doc.fontSize(12).text(`Total Pages Captured: ${screenshots.length}`, 50, 100);
  
  // Table of contents
  doc.addPage();
  doc.fontSize(18).text('Table of Contents', 50, 50);
  doc.fontSize(11);
  
  let yPos = 80;
  screenshots.forEach((screenshot, index) => {
    doc.text(`${index + 1}. ${screenshot.name} (${screenshot.path})`, 50, yPos);
    yPos += 20;
    if (yPos > 750) {
      doc.addPage();
      yPos = 50;
    }
  });
  
  // Screenshot pages
  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    
    if (!fs.existsSync(screenshot.file)) {
      continue;
    }
    
    doc.addPage();
    
    // Page header
    doc.fontSize(16).text(`${i + 1}. ${screenshot.name}`, 50, 50);
    doc.fontSize(12).text(`Route: ${screenshot.path}`, 50, 70);
    doc.fontSize(10).text(`File: ${path.basename(screenshot.file)}`, 50, 85);
    
    // Add screenshot
    try {
      const imageWidth = 500; // Max width for A4
      const imageX = (doc.page.width - imageWidth) / 2;
      
      doc.image(screenshot.file, imageX, 110, { 
        width: imageWidth,
        height: undefined // Maintain aspect ratio
      });
    } catch (error) {
      doc.text(`Error loading image: ${error.message}`, 50, 110);
    }
  }
  
  doc.end();
  console.log('✓ PDF created: CABANA_Frontend_Screenshots.pdf');
}

async function generateMobilePDF(screenshots) {
  console.log('Creating Mobile PDF...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 375, height: 667 } // iPhone viewport
  });
  
  const page = await browser.newPage();
  const mobileScreenshots = [];
  const outputDir = './screenshots/mobile';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Capture mobile versions
  for (const route of routes.slice(0, 10)) { // Limit for speed
    try {
      console.log(`Capturing mobile: ${route.name}`);
      
      await page.goto(`http://localhost:8080${route.path}`, { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });
      
      await page.waitForTimeout(2000);
      
      const filename = `mobile_${route.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const filepath = path.join(outputDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true 
      });
      
      mobileScreenshots.push({
        name: `${route.name} (Mobile)`,
        path: route.path,
        file: filepath
      });
      
    } catch (error) {
      console.log(`✗ Mobile capture failed for ${route.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  
  // Create mobile PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream('./CABANA_Mobile_Screenshots.pdf'));
  
  doc.fontSize(24).text('CABANA Mobile Frontend Screenshots', 50, 50);
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, 50, 80);
  
  for (let i = 0; i < mobileScreenshots.length; i++) {
    const screenshot = mobileScreenshots[i];
    
    if (!fs.existsSync(screenshot.file)) continue;
    
    doc.addPage();
    doc.fontSize(16).text(screenshot.name, 50, 50);
    doc.fontSize(12).text(`Route: ${screenshot.path}`, 50, 70);
    
    try {
      doc.image(screenshot.file, 150, 100, { width: 300 });
    } catch (error) {
      doc.text(`Error: ${error.message}`, 50, 110);
    }
  }
  
  doc.end();
  console.log('✓ Mobile PDF created: CABANA_Mobile_Screenshots.pdf');
}

async function main() {
  try {
    console.log('CABANA Frontend Screenshot Generator');
    console.log('====================================');
    
    // Check if dev server is running
    console.log('Checking if dev server is running on localhost:8080...');
    
    const screenshots = await captureScreenshots();
    
    if (screenshots.length === 0) {
      console.log('No screenshots captured. Make sure the dev server is running on localhost:8080');
      return;
    }
    
    await createPDF(screenshots);
    await generateMobilePDF(screenshots);
    
    console.log('');
    console.log('✓ Screenshot generation complete!');
    console.log('Files generated:');
    console.log('- CABANA_Frontend_Screenshots.pdf (Desktop)');
    console.log('- CABANA_Mobile_Screenshots.pdf (Mobile)');
    console.log('- screenshots/ (Individual PNG files)');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();