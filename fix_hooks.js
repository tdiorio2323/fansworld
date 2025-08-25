const fs = require('fs');

const files = [
  'src/features/addons/ai-content-tagging/components/AITagging.tsx',
  'src/features/addons/loyalty-program/components/LoyaltyProgram.tsx', 
  'src/features/addons/one-click-upsells/components/Upsells.tsx',
  'src/features/addons/stories-highlights/components/Stories.tsx'
];

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern: Move useEffect hooks before conditional returns
    // This is a simple fix - in practice you'd want more sophisticated parsing
    const lines = content.split('\n');
    const newLines = [];
    const hooks = [];
    let inComponent = false;
    let foundReturn = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect component start (simplified)
      if (line.includes('const ') && line.includes(' = (') && !inComponent) {
        inComponent = true;
        newLines.push(line);
        continue;
      }
      
      // If we find an early return, flag it
      if (inComponent && !foundReturn && line.trim().startsWith('if (') && 
          i + 2 < lines.length && lines[i + 1].trim().includes('return null')) {
        foundReturn = true;
        // Collect any useEffect hooks that come after
        let j = i + 3;
        while (j < lines.length && !lines[j].includes('const ') && !lines[j].includes('function ')) {
          if (lines[j].trim().startsWith('useEffect(')) {
            // Found a hook after return - need to move it before
            let hookEnd = j;
            let braceCount = 0;
            for (let k = j; k < lines.length; k++) {
              if (lines[k].includes('{')) braceCount++;
              if (lines[k].includes('}')) braceCount--;
              if (braceCount === 0 && lines[k].includes('});')) {
                hookEnd = k;
                break;
              }
            }
            
            // Extract the hook
            const hookLines = lines.slice(j, hookEnd + 1);
            hooks.push(...hookLines);
            
            // Remove from original position
            lines.splice(j, hookEnd - j + 1);
            break;
          }
          j++;
        }
      }
      
      newLines.push(line);
      
      // Insert hooks before the conditional return
      if (foundReturn && hooks.length > 0 && line.trim().startsWith('if (')) {
        newLines.splice(newLines.length - 1, 0, '', ...hooks, '');
        hooks.length = 0;
        foundReturn = false;
      }
    }
    
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
});
