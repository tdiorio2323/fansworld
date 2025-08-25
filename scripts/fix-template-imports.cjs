#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getRelativePath(fromPath, toPath) {
  const relativePath = path.relative(path.dirname(fromPath), toPath);
  return relativePath.startsWith('.') ? relativePath : './' + relativePath;
}

function fixImports(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      fixImports(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Fix template imports
      const templatesDir = path.join(__dirname, '../app/_templates');
      
      if (content.includes('_templates/MarketingPage')) {
        const correctPath = getRelativePath(fullPath, path.join(templatesDir, 'MarketingPage'));
        content = content.replace(/from\s+["'].*_templates\/MarketingPage["']/g, `from "${correctPath}"`);
        modified = true;
      }
      
      if (content.includes('_templates/DashboardTwoCol')) {
        const correctPath = getRelativePath(fullPath, path.join(templatesDir, 'DashboardTwoCol'));
        content = content.replace(/from\s+["'].*_templates\/DashboardTwoCol["']/g, `from "${correctPath}"`);
        modified = true;
      }
      
      if (content.includes('_templates/FormPage')) {
        const correctPath = getRelativePath(fullPath, path.join(templatesDir, 'FormPage'));
        content = content.replace(/from\s+["'].*_templates\/FormPage["']/g, `from "${correctPath}"`);
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Fixed imports in ${fullPath}`);
      }
    }
  }
}

console.log('🔧 Fixing template import paths...');
fixImports(path.join(__dirname, '../app'));
console.log('✅ Import paths fixed!');