#!/usr/bin/env node

const generateComponent = require('./generate-component');

const components = [
  {
    prompt: "Create a creator profile card with avatar, name, subscriber count, monthly earnings, and subscribe button using dark theme with gradient accents and premium styling",
    filename: "CreatorProfileCard.tsx"
  },
  {
    prompt: "Build a content upload form with drag-and-drop file area, image preview, pricing options (free, premium, pay-per-view), and description field using dark theme",
    filename: "ContentUploadForm.tsx"
  },
  {
    prompt: "Design an earnings dashboard widget showing total earnings, monthly growth percentage, mini chart, and recent transactions with dark background and luxury styling",
    filename: "EarningsWidget.tsx"
  },
  {
    prompt: "Create a content gallery grid with image thumbnails, premium badges, view counts, and hover effects using dark theme with neon accents",
    filename: "ContentGallery.tsx"
  },
  {
    prompt: "Build a subscription management card showing current plan, billing info, upgrade options, and cancel button with premium card styling",
    filename: "SubscriptionCard.tsx"
  }
];

async function generateAllComponents() {
  console.log('🚀 Generating FansWorld components...');
  
  for (const component of components) {
    await generateComponent(component.prompt, component.filename);
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 All components generated!');
}

generateAllComponents();
