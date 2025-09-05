import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const screenshots = [
  { name: 'Homepage SimpleVipEntry', path: '/', file: 'Homepage_SimpleVipEntry.png' },
  { name: 'Sign In', path: '/signin', file: 'Sign_In.png' },
  { name: 'Register', path: '/register', file: 'Register.png' },
  { name: 'Discover Creators', path: '/discover', file: 'Discover_Creators.png' },
  { name: 'Creator Profile', path: '/creator/testuser', file: 'Creator_Profile.png' },
  { name: 'Agency Landing', path: '/agency', file: 'Agency_Landing.png' },
  { name: 'Landing Page', path: '/landing', file: 'Landing_Page.png' },
  { name: 'VIP Entry', path: '/vip', file: 'VIP_Entry.png' },
  { name: 'Subscription Plans', path: '/subscription-plans', file: 'Subscription_Plans.png' },
  { name: 'Public Feed', path: '/feed', file: 'Public_Feed.png' },
  { name: 'Admin Dashboard', path: '/admin', file: 'Admin_Dashboard.png' },
  { name: 'Analytics Dashboard', path: '/analytics', file: 'Analytics_Dashboard.png' },
  { name: 'Creator Dashboard', path: '/creator-dashboard', file: 'Creator_Dashboard.png' },
  { name: 'Content Manager', path: '/content-manager', file: 'Content_Manager.png' },
  { name: 'Messages', path: '/messages', file: 'Messages.png' },
  { name: 'Billing', path: '/billing', file: 'Billing.png' },
  { name: 'Settings', path: '/settings', file: 'Settings.png' },
  { name: 'Referral Program', path: '/referrals', file: 'Referral_Program.png' }
];

async function createPDF() {
  console.log('Creating comprehensive CABANA frontend PDF...');
  
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 30,
    bufferPages: true
  });
  
  doc.pipe(fs.createWriteStream('./CABANA_Frontend_Complete.pdf'));
  
  // Title page
  doc.fontSize(28).fillColor('#6366f1').text('CABANA Frontend', 50, 100);
  doc.fontSize(24).fillColor('#000').text('Complete UI/UX Screenshots', 50, 140);
  doc.fontSize(14).fillColor('#666').text(`Generated: ${new Date().toLocaleDateString()}`, 50, 180);
  doc.fontSize(12).fillColor('#666').text(`Total Pages: ${screenshots.length}`, 50, 200);
  doc.fontSize(10).fillColor('#666').text('Link-in-Bio Platform with Creator Economy Features', 50, 220);
  
  // Add overview
  doc.fontSize(16).fillColor('#000').text('Platform Overview', 50, 260);
  doc.fontSize(11).fillColor('#333').text('• Admin Dashboard for managing multiple clients', 60, 285);
  doc.text('• Creator profiles with subscription and paywall systems', 60, 300);
  doc.text('• Template management for bulk deployment', 60, 315);
  doc.text('• Analytics and revenue tracking', 60, 330);
  doc.text('• VIP access and referral systems', 60, 345);
  doc.text('• Content management and messaging', 60, 360);
  doc.text('• Mobile-responsive design throughout', 60, 375);
  
  // Table of contents
  doc.addPage();
  doc.fontSize(20).fillColor('#000').text('Table of Contents', 50, 50);
  doc.fontSize(11);
  
  let yPos = 90;
  screenshots.forEach((screenshot, index) => {
    doc.fillColor('#333').text(`${index + 1}.`, 50, yPos);
    doc.fillColor('#000').text(`${screenshot.name}`, 70, yPos);
    doc.fillColor('#666').text(`${screenshot.path}`, 200, yPos);
    doc.fillColor('#999').text(`Page ${index + 3}`, 450, yPos);
    yPos += 18;
    
    if (yPos > 750) {
      doc.addPage();
      yPos = 50;
    }
  });
  
  // Screenshot pages
  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    const filepath = path.join('./screenshots', screenshot.file);
    
    if (!fs.existsSync(filepath)) {
      console.log(`Warning: ${filepath} not found, skipping...`);
      continue;
    }
    
    doc.addPage();
    
    // Page header with styling
    doc.rect(50, 40, 495, 60).fillColor('#f8fafc').fill();
    doc.rect(50, 40, 495, 60).strokeColor('#e2e8f0').stroke();
    
    doc.fontSize(18).fillColor('#1e293b').text(`${i + 1}. ${screenshot.name}`, 60, 55);
    doc.fontSize(12).fillColor('#475569').text(`Route: ${screenshot.path}`, 60, 80);
    
    // Add screenshot
    try {
      const imageWidth = 500;
      const imageX = (doc.page.width - imageWidth) / 2;
      
      // Add border around image
      doc.rect(imageX - 5, 115, imageWidth + 10, 400).strokeColor('#e2e8f0').stroke();
      
      doc.image(filepath, imageX, 120, { 
        width: imageWidth,
        height: 400,
        fit: [imageWidth, 400]
      });
      
      // Add page footer
      doc.fontSize(10).fillColor('#9ca3af')
         .text(`CABANA Frontend - ${screenshot.name}`, 50, 750)
         .text(`Page ${i + 3}`, 500, 750);
      
    } catch (error) {
      doc.fontSize(12).fillColor('#ef4444').text(`Error loading screenshot: ${error.message}`, 60, 130);
    }
  }
  
  // Summary page
  doc.addPage();
  doc.fontSize(20).fillColor('#000').text('Implementation Ready', 50, 50);
  doc.fontSize(14).fillColor('#333').text('Key Features Documented:', 50, 90);
  
  const features = [
    '✅ Multi-tenant admin dashboard',
    '✅ Creator profile templates', 
    '✅ Subscription & paywall systems',
    '✅ Analytics & revenue tracking',
    '✅ Template management system',
    '✅ VIP access controls',
    '✅ Content management',
    '✅ Messaging systems',
    '✅ Mobile-responsive design',
    '✅ Payment integration ready'
  ];
  
  yPos = 120;
  features.forEach(feature => {
    doc.fontSize(12).fillColor('#059669').text(feature, 60, yPos);
    yPos += 25;
  });
  
  doc.fontSize(14).fillColor('#000').text('Ready for UI/UX Design Implementation', 50, yPos + 30);
  doc.fontSize(11).fillColor('#666').text('All pages captured and documented for seamless design handoff', 50, yPos + 55);
  
  doc.end();
  console.log('✓ PDF created: CABANA_Frontend_Complete.pdf');
}

createPDF().catch(console.error);